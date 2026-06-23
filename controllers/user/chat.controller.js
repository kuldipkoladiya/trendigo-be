import httpStatus from 'http-status';
import { chatMessageService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getUserConversations = catchAsync(async (req, res) => {
  const senderId = req.user._id.toString();
  const senderModel = 'User';
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
