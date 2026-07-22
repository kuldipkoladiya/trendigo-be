import httpStatus from 'http-status';
import { chatMessageService, s3Service } from 'services';
import { catchAsync } from 'utils/catchAsync';
import config from 'config/config';

export const getUserConversations = catchAsync(async (req, res) => {
  const senderId = req.user._id.toString();
  await req.user.populate('role');
  const roleName = req.user.role && req.user.role.role;
  const isAdmin = ['admin', 'super-admin', 'co-admin'].includes(roleName);
  const senderModel = isAdmin ? 'Admin' : 'User';
  const conversations = await chatMessageService.getConversations(senderId, senderModel);
  return res.status(httpStatus.OK).send({ results: conversations });
});

export const getSellerConversations = catchAsync(async (req, res) => {
  const senderId = req.user._id.toString();
  const senderModel = 'SellerUser';
  const conversations = await chatMessageService.getConversations(senderId, senderModel);
  return res.status(httpStatus.OK).send({ results: conversations });
});

export const getMessages = catchAsync(async (req, res) => {
  const senderId = req.user._id.toString();
  const { counterpartyId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  await chatMessageService.markAsRead(counterpartyId, senderId);

  const filter = {
    $or: [
      { senderId, receiverId: counterpartyId },
      { senderId: counterpartyId, receiverId: senderId },
    ],
  };

  const messages = await chatMessageService.getMessages(filter, { page, limit });
  return res.status(httpStatus.OK).send({ results: messages });
});

export const getChatUploadUrl = catchAsync(async (req, res) => {
  const { fileName, fileType } = req.body;
  if (!fileName || !fileType) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'fileName and fileType are required' });
  }

  const senderId = req.user._id.toString();
  const timestamp = Date.now();
  const key = `chats/${senderId}/${timestamp}_${fileName}`;

  const uploadUrl = await s3Service.getSignedUrlPutObject(key, fileType, true);
  const fileUrl = `https://${config.aws.bucket}.s3.amazonaws.com/${key}`;

  return res.status(httpStatus.OK).send({
    uploadUrl,
    fileUrl,
  });
});
