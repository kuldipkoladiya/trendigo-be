import express from 'express';
import { sellerUserController } from 'controllers/user';
import { sellerUserValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerUser
   * */
  .post(auth('user'), validate(sellerUserValidation.createSellerUser), sellerUserController.createSellerUser)
  /**
   * getSellerUser
   * */
  .get(auth('user'), validate(sellerUserValidation.getSellerUser), sellerUserController.listSellerUser);
router
  .route('/paginated')
  /**
   * getSellerUserPaginated
   * */
  .get(auth('user'), validate(sellerUserValidation.paginatedSellerUser), sellerUserController.paginateSellerUser);
router
  .route('/:sellerUserId')
  /**
   * getSellerUserById
   * */
  .get(auth('user'), validate(sellerUserValidation.getSellerUserById), sellerUserController.getSellerUser)
  /**
   * updateSellerUser
   * */
  .put(auth('user'), validate(sellerUserValidation.updateSellerUser), sellerUserController.updateSellerUser)
  /**
   * deleteSellerUserById
   * */
  .delete(auth('user'), validate(sellerUserValidation.deleteSellerUserById), sellerUserController.removeSellerUser);
export default router;
