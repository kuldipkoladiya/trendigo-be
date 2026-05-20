import express from 'express';
import { paymentController } from 'controllers/admin';
import { paymentValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createPayment
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(paymentValidation.createPayment),
    paymentController.createPayment
  )
  /**
   * getPayment
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(paymentValidation.getPayment),
    paymentController.listPayment
  );
router
  .route('/paginated')
  /**
   * getPaymentPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(paymentValidation.paginatedPayment),
    paymentController.paginatePayment
  );
router
  .route('/:paymentId')
  /**
   * getPaymentById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(paymentValidation.getPaymentById),
    paymentController.getPayment
  )
  /**
   * updatePayment
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(paymentValidation.updatePayment),
    paymentController.updatePayment
  )
  /**
   * deletePaymentById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(paymentValidation.deletePaymentById),
    paymentController.removePayment
  );
export default router;
