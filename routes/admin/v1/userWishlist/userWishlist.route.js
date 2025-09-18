import express from 'express';
import { userWishlistController } from 'controllers/admin';
import { userWishlistValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserWishlist
   * */
  .post(auth('admin'), validate(userWishlistValidation.createUserWishlist), userWishlistController.createUserWishlist)
  /**
   * getUserWishlist
   * */
  .get(auth('admin'), validate(userWishlistValidation.getUserWishlist), userWishlistController.listUserWishlist);
router
  .route('/paginated')
  /**
   * getUserWishlistPaginated
   * */
  .get(auth('admin'), validate(userWishlistValidation.paginatedUserWishlist), userWishlistController.paginateUserWishlist);
router
  .route('/:userWishlistId')
  /**
   * getUserWishlistById
   * */
  .get(auth('admin'), validate(userWishlistValidation.getUserWishlistById), userWishlistController.getUserWishlist)
  /**
   * updateUserWishlist
   * */
  .put(auth('admin'), validate(userWishlistValidation.updateUserWishlist), userWishlistController.updateUserWishlist)
  /**
   * deleteUserWishlistById
   * */
  .delete(auth('admin'), validate(userWishlistValidation.deleteUserWishlistById), userWishlistController.removeUserWishlist);
export default router;
