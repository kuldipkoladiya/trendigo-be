import express from 'express';
import { cartController } from 'controllers/user';
import { cartValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createCart
   * */
  .post(auth('user'), validate(cartValidation.createCart), cartController.createCart)
  /**
   * getCart
   * */
  .get(auth('user'), validate(cartValidation.getCart), cartController.listCart);
router
  .route('/paginated')
  /**
   * getCartPaginated
   * */
  .get(auth('user'), validate(cartValidation.paginatedCart), cartController.paginateCart);
router
  .route('/:cartId')
  /**
   * getCartById
   * */
  .get(auth('user'), validate(cartValidation.getCartById), cartController.getCart)
  /**
   * updateCart
   * */
  .put(auth('user'), validate(cartValidation.updateCart), cartController.updateCart)
  /**
   * deleteCartById
   * */
  .delete(auth('user'), validate(cartValidation.deleteCartById), cartController.removeCart);
export default router;
