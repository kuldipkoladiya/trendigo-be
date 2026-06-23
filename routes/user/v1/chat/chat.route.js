import express from 'express';
import auth from 'middlewares/auth';
import sellerAuth from 'middlewares/sellerAuth';
import { chatController } from 'controllers/user';

const router = express.Router();

// Middleware to authorize either a User or a Seller
const eitherAuth = () => async (req, res, next) => {
  return auth()(req, res, (err) => {
    if (!err && req.user) {
      return next();
    }
    return sellerAuth()(req, res, next);
  });
};

router.get('/conversations', auth(), chatController.getUserConversations);
router.get('/seller-conversations', sellerAuth(), chatController.getSellerConversations);
router.get('/messages/:counterpartyId', eitherAuth(), chatController.getMessages);

export default router;
