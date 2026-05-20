import express from 'express';
import { userWishlistController } from 'controllers/admin';
import { userWishlistValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createUserWishlist
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userWishlistValidation.createUserWishlist),
    userWishlistController.createUserWishlist
  )
  /**
   * getUserWishlist
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userWishlistValidation.getUserWishlist),
    userWishlistController.listUserWishlist
  );
router
  .route('/paginated')
  /**
   * getUserWishlistPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userWishlistValidation.paginatedUserWishlist),
    userWishlistController.paginateUserWishlist
  );
router
  .route('/:userWishlistId')
  /**
   * getUserWishlistById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userWishlistValidation.getUserWishlistById),
    userWishlistController.getUserWishlist
  )
  /**
   * updateUserWishlist
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userWishlistValidation.updateUserWishlist),
    userWishlistController.updateUserWishlist
  )
  /**
   * deleteUserWishlistById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userWishlistValidation.deleteUserWishlistById),
    userWishlistController.removeUserWishlist
  );
export default router;
