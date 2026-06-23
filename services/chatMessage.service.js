/* eslint-disable no-param-reassign */
import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { ChatMessage, Role, User } from 'models';
import mongoose from 'mongoose';

export async function sendMessage(body = {}) {
  const message = await ChatMessage.create(body);

  // Fetch the created message with populated fields so the socket emits full data instantly
  const populatedMessage = await ChatMessage.findById(message._id).populate([
    { path: 'senderId', select: 'name email profilePic businessName' },
    { path: 'receiverId', select: 'name email profilePic businessName' },
    { path: 'product' },
  ]);

  return populatedMessage;
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
      { path: 'product' },
    ],
  });
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
      if (conv._id && conv._id.model === 'User') {
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
