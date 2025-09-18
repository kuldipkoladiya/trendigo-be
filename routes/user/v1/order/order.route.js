import express from 'express';
import { orderController } from 'controllers/user';
import { orderValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createOrder
   * */
  .post(auth('user'), validate(orderValidation.createOrder), orderController.createOrder)
  /**
   * getOrder
   * */
  .get(auth('user'), validate(orderValidation.getOrder), orderController.listOrder);
router
  .route('/paginated')
  /**
   * getOrderPaginated
   * */
  .get(auth('user'), validate(orderValidation.paginatedOrder), orderController.paginateOrder);
router
  .route('/:orderId')
  /**
   * getOrderById
   * */
  .get(auth('user'), validate(orderValidation.getOrderById), orderController.getOrder)
  /**
   * updateOrder
   * */
  .put(auth('user'), validate(orderValidation.updateOrder), orderController.updateOrder)
  /**
   * deleteOrderById
   * */
  .delete(auth('user'), validate(orderValidation.deleteOrderById), orderController.removeOrder);
export default router;
