import express from 'express';
import { paymentController } from 'controllers/admin';
import { paymentValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createPayment
   * */
  .post(auth('admin'), validate(paymentValidation.createPayment), paymentController.createPayment)
  /**
   * getPayment
   * */
  .get(auth('admin'), validate(paymentValidation.getPayment), paymentController.listPayment);
router
  .route('/paginated')
  /**
   * getPaymentPaginated
   * */
  .get(auth('admin'), validate(paymentValidation.paginatedPayment), paymentController.paginatePayment);
router
  .route('/:paymentId')
  /**
   * getPaymentById
   * */
  .get(auth('admin'), validate(paymentValidation.getPaymentById), paymentController.getPayment)
  /**
   * updatePayment
   * */
  .put(auth('admin'), validate(paymentValidation.updatePayment), paymentController.updatePayment)
  /**
   * deletePaymentById
   * */
  .delete(auth('admin'), validate(paymentValidation.deletePaymentById), paymentController.removePayment);
export default router;
