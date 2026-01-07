import express from 'express';
import { userWishlistController } from 'controllers/user';
import { userWishlistValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserWishlist
   * */
  .post(auth('user'), validate(userWishlistValidation.createUserWishlist), userWishlistController.createUserWishlist)
  /**
   * getUserWishlist
   * */
  .get(auth('user'), validate(userWishlistValidation.getUserWishlist), userWishlistController.listUserWishlist);
router
  .route('/userWishlist')
  /**
   * getUserWishlistPaginated (Logged-in User)
   */
  .get(auth('user'), validate(userWishlistValidation.paginatedUserWishlist), userWishlistController.userWishlist);
router
  .route('/paginated')
  /**
   * getUserWishlistPaginated
   * */
  .get(auth('user'), validate(userWishlistValidation.paginatedUserWishlist), userWishlistController.paginateUserWishlist);
router
  .route('/:userWishlistId')
  /**
   * getUserWishlistById
   * */
  .get(auth('user'), validate(userWishlistValidation.getUserWishlistById), userWishlistController.getUserWishlist)
  /**
   * updateUserWishlist
   * */
  .put(auth('user'), validate(userWishlistValidation.updateUserWishlist), userWishlistController.updateUserWishlist)
  /**
   * deleteUserWishlistById
   * */
  .delete(auth('user'), validate(userWishlistValidation.deleteUserWishlistById), userWishlistController.removeUserWishlist);
export default router;
