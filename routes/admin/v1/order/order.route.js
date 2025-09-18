import express from 'express';
import { orderController } from 'controllers/admin';
import { orderValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createOrder
   * */
  .post(auth('admin'), validate(orderValidation.createOrder), orderController.createOrder)
  /**
   * getOrder
   * */
  .get(auth('admin'), validate(orderValidation.getOrder), orderController.listOrder);
router
  .route('/paginated')
  /**
   * getOrderPaginated
   * */
  .get(auth('admin'), validate(orderValidation.paginatedOrder), orderController.paginateOrder);
router
  .route('/:orderId')
  /**
   * getOrderById
   * */
  .get(auth('admin'), validate(orderValidation.getOrderById), orderController.getOrder)
  /**
   * updateOrder
   * */
  .put(auth('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
  /**
   * deleteOrderById
   * */
  .delete(auth('admin'), validate(orderValidation.deleteOrderById), orderController.removeOrder);
export default router;
