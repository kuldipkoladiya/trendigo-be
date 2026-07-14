import { chatMessageService, s3Service } from '../services';

const mongoose = require('mongoose');
const { initSubscription } = require('./subscriptions');

if (!mongoose.models.Admin) {
  mongoose.model('Admin', mongoose.model('User').schema, 'User');
}

const socketAPI = {};

socketAPI.bindEvents = (io) => {
  socketAPI.io = io;

  io.use(initSubscription).on('connection', function (socket) {
    const senderId = socket.user._id.toString();
    const senderModel = socket.userModel; // 'User' | 'SellerUser'

    // Standard chat message payload: { receiverId, receiverModel, message, productId? }
    socket.on('send_message', async function (data, callback) {
      try {
        const { receiverId, receiverModel, message, productId, file, fileName, fileType } = data;

        let fileUrl = null;
        if (file) {
          fileUrl = await s3Service.uploadBase64ToS3(file, fileName, fileType);
        }

        const chatMessage = await chatMessageService.sendMessage({
          senderId,
          senderModel,
          receiverId,
          receiverModel,
          message,
          product: productId || null,
          fileUrl,
          fileType: file ? fileType : null,
          fileName: file ? fileName : null,
        });

        // Broadcast to receiver
        io.to(receiverId.toString()).emit('receive_message', chatMessage);

        // Auto-update conversations list for sender and receiver
        const senderConversations = await chatMessageService.getConversations(senderId, senderModel);
        io.to(senderId).emit('conversations_list', senderConversations);

        const receiverConversations = await chatMessageService.getConversations(receiverId.toString(), receiverModel);
        io.to(receiverId.toString()).emit('conversations_list', receiverConversations);

        // Respond to sender
        if (typeof callback === 'function') {
          callback({ success: true, data: chatMessage });
        } else {
          socket.emit('message_sent', chatMessage);
        }
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: err.message });
        else socket.emit('error', { event: 'send_message', message: 'Failed to send message', error: err.message });
      }
    });

    // Specifically for Seller sending a message to the main Admin without knowing the Admin's ID
    socket.on('send_message_to_admin', async function (data, callback) {
      try {
        const { message, file, fileName, fileType } = data;
        const admin = await chatMessageService.getMainAdmin();

        let fileUrl = null;
        if (file) {
          fileUrl = await s3Service.uploadBase64ToS3(file, fileName, fileType);
        }

        const chatMessage = await chatMessageService.sendMessage({
          senderId,
          senderModel,
          receiverId: admin._id,
          receiverModel: 'Admin',
          message,
          fileUrl,
          fileType: file ? fileType : null,
          fileName: file ? fileName : null,
        });

        io.to(admin._id.toString()).emit('receive_message', chatMessage);

        // Auto-update conversations list for sender and receiver (admin)
        const senderConversations = await chatMessageService.getConversations(senderId, senderModel);
        io.to(senderId).emit('conversations_list', senderConversations);

        const receiverConversations = await chatMessageService.getConversations(admin._id.toString(), 'Admin');
        io.to(admin._id.toString()).emit('conversations_list', receiverConversations);

        if (typeof callback === 'function') {
          callback({ success: true, data: chatMessage });
        } else {
          socket.emit('message_sent', chatMessage);
        }
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: err.message });
        else
          socket.emit('error', { event: 'send_message_to_admin', message: 'Failed to send to admin', error: err.message });
      }
    });

    // Get conversations (recent chats list)
    socket.on('get_conversations', async function (...args) {
      let callback = null;
      if (args.length > 0) {
        if (typeof args[args.length - 1] === 'function') callback = args.pop();
      }

      try {
        const conversations = await chatMessageService.getConversations(senderId, senderModel);
        if (callback) {
          callback({ success: true, data: conversations });
        } else {
          socket.emit('conversations_list', conversations);
        }
      } catch (err) {
        if (callback) callback({ success: false, error: err.message });
        else
          socket.emit('error', { event: 'get_conversations', message: 'Failed to get conversations', error: err.message });
      }
    });

    // Get messages for a specific conversation
    // Payload: { counterpartyId, page?, limit? } OR counterpartyId string
    socket.on('get_messages', async function (...args) {
      let data = {};
      let callback = null;
      if (args.length > 0) {
        if (typeof args[args.length - 1] === 'function') callback = args.pop();
        if (args.length > 0) data = args[0] || {};
      }

      try {
        let counterpartyId;
        let page = 1;
        let limit = 10;

        if (typeof data === 'string') {
          counterpartyId = data;
        } else if (data && typeof data === 'object') {
          counterpartyId = data.counterpartyId;
          if (data.page) page = data.page;
          if (data.limit) limit = data.limit;
        }

        if (!counterpartyId) throw new Error('counterpartyId is required');

        // Mark messages from the counterparty as read
        await chatMessageService.markAsRead(counterpartyId, senderId);

        // Emit updated conversations to the sender (so their unread count decreases to 0)
        const updatedConversations = await chatMessageService.getConversations(senderId, senderModel);
        socket.emit('conversations_list', updatedConversations);

        const filter = {
          $or: [
            { senderId, receiverId: counterpartyId },
            { senderId: counterpartyId, receiverId: senderId },
          ],
        };

        const messages = await chatMessageService.getMessages(filter, { page, limit });
        if (callback) {
          callback({ success: true, data: messages });
        } else {
          socket.emit('messages_list', messages);
        }
      } catch (err) {
        if (callback) callback({ success: false, error: err.message });
        else socket.emit('error', { event: 'get_messages', message: 'Failed to get messages', error: err.message });
      }
    });

    socket.on('delete_message', async function (data, callback) {
      try {
        let messageId;
        if (typeof data === 'string') {
          messageId = data;
        } else if (data && typeof data === 'object') {
          messageId = data.messageId;
        }

        if (!messageId) throw new Error('messageId is required');

        const deletedMessage = await chatMessageService.deleteMessage(messageId, senderId, senderModel);

        // Broadcast/emit to receiver that message is deleted
        io.to(deletedMessage.receiverId.toString()).emit('message_deleted', { messageId });

        // Update conversations for both parties
        const senderConversations = await chatMessageService.getConversations(senderId, senderModel);
        io.to(senderId).emit('conversations_list', senderConversations);

        const receiverConversations = await chatMessageService.getConversations(
          deletedMessage.receiverId.toString(),
          deletedMessage.receiverModel
        );
        io.to(deletedMessage.receiverId.toString()).emit('conversations_list', receiverConversations);

        if (typeof callback === 'function') {
          callback({ success: true, messageId });
        } else {
          socket.emit('message_deleted', { messageId });
        }
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: err.message });
        else socket.emit('error', { event: 'delete_message', message: 'Failed to delete message', error: err.message });
      }
    });

    socket.on('read_message', async function (data, callback) {
      try {
        let messageId;
        if (typeof data === 'string') {
          messageId = data;
        } else if (data && typeof data === 'object') {
          messageId = data.messageId;
        }

        if (!messageId) throw new Error('messageId is required');

        const { message, allRead, updatedMessageIds } = await chatMessageService.readMessage(messageId, senderId);

        // Broadcast status update to sender
        io.to(message.senderId.toString()).emit('message_read', {
          messageId: message.id,
          senderId: message.senderId.toString(),
          receiverId: message.receiverId.toString(),
          allRead,
          updatedMessageIds,
        });

        // Broadcast to receiver (or sender user) conversations_list updates
        const senderConversations = await chatMessageService.getConversations(
          message.senderId.toString(),
          message.senderModel
        );
        io.to(message.senderId.toString()).emit('conversations_list', senderConversations);

        const receiverConversations = await chatMessageService.getConversations(senderId, senderModel);
        io.to(senderId).emit('conversations_list', receiverConversations);

        if (typeof callback === 'function') {
          callback({ success: true, messageId: message.id, allRead, updatedMessageIds });
        } else {
          socket.emit('message_read', { messageId: message.id, allRead, updatedMessageIds });
        }
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: err.message });
        else socket.emit('error', { event: 'read_message', message: 'Failed to read message', error: err.message });
      }
    });

    socket.on('disconnect', function () {
      // console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketAPI;
