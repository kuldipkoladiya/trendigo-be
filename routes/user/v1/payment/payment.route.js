import express from 'express';
import { paymentController } from 'controllers/user';
import { paymentValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createPayment
   * */
  .post(auth('user'), validate(paymentValidation.createPayment), paymentController.createPayment)
  /**
   * getPayment
   * */
  .get(auth('user'), validate(paymentValidation.getPayment), paymentController.listPayment);
router
  .route('/paginated')
  /**
   * getPaymentPaginated
   * */
  .get(auth('user'), validate(paymentValidation.paginatedPayment), paymentController.paginatePayment);
router
  .route('/:paymentId')
  /**
   * getPaymentById
   * */
  .get(auth('user'), validate(paymentValidation.getPaymentById), paymentController.getPayment)
  /**
   * updatePayment
   * */
  .put(auth('user'), validate(paymentValidation.updatePayment), paymentController.updatePayment)
  /**
   * deletePaymentById
   * */
  .delete(auth('user'), validate(paymentValidation.deletePaymentById), paymentController.removePayment);
export default router;
