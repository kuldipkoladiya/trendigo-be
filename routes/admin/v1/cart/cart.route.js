import express from 'express';
import { cartController } from 'controllers/admin';
import { cartValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createCart
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(cartValidation.createCart),
    cartController.createCart
  )
  /**
   * getCart
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(cartValidation.getCart),
    cartController.listCart
  );
router
  .route('/paginated')
  /**
   * getCartPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(cartValidation.paginatedCart),
    cartController.paginateCart
  );
router
  .route('/:cartId')
  /**
   * getCartById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(cartValidation.getCartById),
    cartController.getCart
  )
  /**
   * updateCart
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(cartValidation.updateCart),
    cartController.updateCart
  )
  /**
   * deleteCartById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(cartValidation.deleteCartById),
    cartController.removeCart
  );
export default router;
