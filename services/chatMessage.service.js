/* eslint-disable no-param-reassign */
import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { ChatMessage, Role, User } from 'models';
import mongoose from 'mongoose';

function formatMessage(doc) {
  if (!doc) return doc;

  const obj = JSON.parse(JSON.stringify(doc));

  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;

  if (obj.senderId && typeof obj.senderId === 'object') {
    if (obj.senderId._id) {
      obj.senderId.id = obj.senderId._id.toString();
      delete obj.senderId._id;
    }
  }

  if (obj.receiverId && typeof obj.receiverId === 'object') {
    if (obj.receiverId._id) {
      obj.receiverId.id = obj.receiverId._id.toString();
      delete obj.receiverId._id;
    }
  }

  if (obj.product && typeof obj.product === 'object') {
    if (obj.product._id) {
      obj.product.id = obj.product._id.toString();
      delete obj.product._id;
    }
    if (Array.isArray(obj.product.variants)) {
      obj.product.variants = obj.product.variants.slice(0, 1).map((variant) => {
        if (variant && typeof variant === 'object') {
          // If it is a Mongoose ObjectId, convert it to a simple object with id
          if (variant.constructor && variant.constructor.name === 'ObjectId') {
            return { id: variant.toString() };
          }

          const v = typeof variant.toObject === 'function' ? variant.toObject() : { ...variant };
          if (v._id) {
            v.id = v._id.toString();
            delete v._id;
          }

          const price = parseFloat(v.price) || 0;
          const discount = parseFloat(v.discount) || 0;

          v.discountAmount = (price * discount) / 100;
          v.sellingPrice = price - v.discountAmount;

          if (Array.isArray(v.images)) {
            v.images = v.images.map((img) => {
              if (img && typeof img === 'object') {
                if (img.constructor && img.constructor.name === 'ObjectId') {
                  return { id: img.toString() };
                }
                const i = typeof img.toObject === 'function' ? img.toObject() : { ...img };
                if (i._id) {
                  i.id = i._id.toString();
                  delete i._id;
                }
                return i;
              }
              return img;
            });
          }
          return v;
        }
        return variant;
      });
    }
  }

  return obj;
}

function filterPrivacyInfo(text) {
  if (!text || typeof text !== 'string') return text;

  // Regex to match email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Regex to match phone/mobile numbers (8-15 digits, ignoring symbols/spaces)
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g;

  return text.replace(emailRegex, '[Email Blocked]').replace(phoneRegex, (match) => {
    const digits = match.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) {
      return '[Phone Blocked]';
    }
    return match;
  });
}

export async function sendMessage(body = {}) {
  if (body.message) {
    body.message = filterPrivacyInfo(body.message);
  }
  const message = await ChatMessage.create(body);

  // Fetch the created message with populated fields so the socket emits full data instantly
  const populatedMessage = await ChatMessage.findById(message._id)
    .populate([
      { path: 'senderId', select: 'name email profilePic businessName' },
      { path: 'receiverId', select: 'name email profilePic businessName' },
      {
        path: 'product',
        select: 'title variants',
        populate: {
          path: 'variants',
          select: 'price sellingPrice discount discountAmount images',
          populate: {
            path: 'images',
            select: 'imageUrl',
          },
        },
      },
    ])
    .lean();

  return formatMessage(populatedMessage);
}

export async function getMessages(filter, options = {}) {
  const queryFilter = { ...filter };
  if (queryFilter.$or) {
    queryFilter.$or = queryFilter.$or.map((clause) => {
      const newClause = { ...clause };
      if (newClause.senderId && typeof newClause.senderId === 'string') {
        newClause.senderId = mongoose.Types.ObjectId(newClause.senderId);
      }
      if (newClause.receiverId && typeof newClause.receiverId === 'string') {
        newClause.receiverId = mongoose.Types.ObjectId(newClause.receiverId);
      }
      return newClause;
    });
  } else {
    if (queryFilter.senderId && typeof queryFilter.senderId === 'string') {
      queryFilter.senderId = mongoose.Types.ObjectId(queryFilter.senderId);
    }
    if (queryFilter.receiverId && typeof queryFilter.receiverId === 'string') {
      queryFilter.receiverId = mongoose.Types.ObjectId(queryFilter.receiverId);
    }
  }

  const messages = await ChatMessage.paginate(queryFilter, {
    ...options,
    lean: true,
    sort: { createdAt: -1 },
    populate: [
      { path: 'senderId', select: 'name email profilePic businessName' },
      { path: 'receiverId', select: 'name email profilePic businessName' },
      {
        path: 'product',
        select: 'title variants',
        populate: {
          path: 'variants',
          select: 'price sellingPrice discount discountAmount images',
          populate: {
            path: 'images',
            select: 'imageUrl',
          },
        },
      },
    ],
  });

  if (messages && Array.isArray(messages.docs)) {
    messages.docs = messages.docs.map((doc) => formatMessage(doc));
  }

  return messages;
}

export async function getConversations(userId, userModel) {
  const conversations = await ChatMessage.aggregate([
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(userId), senderModel: userModel },
          { receiverId: new mongoose.Types.ObjectId(userId), receiverModel: userModel },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
            { id: '$receiverId', model: '$receiverModel' },
            { id: '$senderId', model: '$senderModel' },
          ],
        },
        lastMessage: { $first: '$message' },
        lastMessageAt: { $first: '$createdAt' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] }, { $eq: ['$read', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { lastMessageAt: -1 },
    },
  ]);

  // Manually populate the counter-party details
  await Promise.all(
    conversations.map(async (conv) => {
      if (conv._id && (conv._id.model === 'User' || conv._id.model === 'Admin')) {
        const user = await mongoose
          .model('User')
          .findById(conv._id.id)
          .select('name email profilePic role')
          .populate('role', 'role')
          .lean();

        if (user) {
          const roleName = user.role && user.role.role;
          const isAdmin = ['admin', 'super-admin', 'co-admin'].includes(roleName);
          user.isAdmin = isAdmin;
          conv.isAdmin = isAdmin;
        }
        conv.user = user;
      } else if (conv._id && conv._id.model === 'SellerUser') {
        conv.seller = await mongoose
          .model('SellerUser')
          .findById(conv._id.id)
          .select('name email businessName storeId')
          .populate({
            path: 'storeId',
            select: 'name profileImage description',
          })
          .lean();
      }
    })
  );

  return conversations;
}

export async function getMainAdmin() {
  const superAdminRole = await Role.findOne({ role: 'super-admin' });
  if (superAdminRole) {
    const admin = await User.findOne({ role: superAdminRole._id });
    if (admin) return admin;
  }

  const adminRole = await Role.findOne({ role: 'admin' });
  if (adminRole) {
    const admin = await User.findOne({ role: adminRole._id });
    if (admin) return admin;
  }

  throw new ApiError(httpStatus.NOT_FOUND, 'Main Admin not found');
}

export async function markAsRead(senderId, receiverId) {
  await ChatMessage.updateMany({ senderId, receiverId, read: false }, { $set: { read: true } });
}

export async function readMessage(messageId, receiverId) {
  const message = await ChatMessage.findById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  if (message.receiverId.toString() !== receiverId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to mark this message as read');
  }

  // Find the last message sent by this sender to this receiver
  const lastSentMessage = await ChatMessage.findOne({
    senderId: message.senderId,
    receiverId: message.receiverId,
  }).sort({ createdAt: -1 });

  let allRead = false;
  let updatedMessageIds = [message._id.toString()];

  if (lastSentMessage && lastSentMessage._id.toString() === message._id.toString()) {
    // If the message being read is indeed the last message, find all unread messages from sender to receiver
    const unreadMessages = await ChatMessage.find({
      senderId: message.senderId,
      receiverId: message.receiverId,
      read: false,
    });

    updatedMessageIds = unreadMessages.map((msg) => msg._id.toString());
    if (!updatedMessageIds.includes(message._id.toString())) {
      updatedMessageIds.push(message._id.toString());
    }

    await ChatMessage.updateMany(
      { senderId: message.senderId, receiverId: message.receiverId, read: false },
      { $set: { read: true } }
    );
    allRead = true;
  } else {
    // Just mark this message as read
    message.read = true;
    await message.save();
  }

  return { message: formatMessage(message), allRead, updatedMessageIds };
}

export async function deleteMessage(messageId, userId, userModel) {
  const message = await ChatMessage.findById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  if (message.senderId.toString() !== userId.toString() || message.senderModel !== userModel) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this message');
  }

  await ChatMessage.deleteOne({ _id: messageId });
  return message;
}
