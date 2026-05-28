import express from 'express';
import validate from '../../../middlewares/validate';
import auth from '../../../middlewares/auth';
import { razorpayController } from '../../../controllers/user';
import { razorpayValidation } from '../../../validations/user';

const router = express.Router();

router.post('/create-order', auth(), validate(razorpayValidation.createRazorpayOrder), razorpayController.createOrder);
router.post('/verify-payment', auth(), validate(razorpayValidation.verifyPayment), razorpayController.verifyPayment);

export default router;
