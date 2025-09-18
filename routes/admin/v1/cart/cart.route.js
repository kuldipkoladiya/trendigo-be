import express from 'express';
import { cartController } from 'controllers/admin';
import { cartValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createCart
   * */
  .post(auth('admin'), validate(cartValidation.createCart), cartController.createCart)
  /**
   * getCart
   * */
  .get(auth('admin'), validate(cartValidation.getCart), cartController.listCart);
router
  .route('/paginated')
  /**
   * getCartPaginated
   * */
  .get(auth('admin'), validate(cartValidation.paginatedCart), cartController.paginateCart);
router
  .route('/:cartId')
  /**
   * getCartById
   * */
  .get(auth('admin'), validate(cartValidation.getCartById), cartController.getCart)
  /**
   * updateCart
   * */
  .put(auth('admin'), validate(cartValidation.updateCart), cartController.updateCart)
  /**
   * deleteCartById
   * */
  .delete(auth('admin'), validate(cartValidation.deleteCartById), cartController.removeCart);
export default router;
