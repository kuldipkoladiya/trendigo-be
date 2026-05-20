import express from 'express';
import { orderController } from 'controllers/admin';
import { orderValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createOrder
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(orderValidation.createOrder),
    orderController.createOrder
  )
  /**
   * getOrder
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(orderValidation.getOrder),
    orderController.listOrder
  );
router
  .route('/paginated')
  /**
   * getOrderPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(orderValidation.paginatedOrder),
    orderController.paginateOrder
  );
router
  .route('/:orderId')
  /**
   * getOrderById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(orderValidation.getOrderById),
    orderController.getOrder
  )
  /**
   * updateOrder
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(orderValidation.updateOrder),
    orderController.updateOrder
  )
  /**
   * deleteOrderById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(orderValidation.deleteOrderById),
    orderController.removeOrder
  );
export default router;
