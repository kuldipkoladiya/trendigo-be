import express from 'express';
import { sellerUserController } from 'controllers/admin';
import { sellerUserValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerUser
   * */
  .post(auth('admin'), validate(sellerUserValidation.createSellerUser), sellerUserController.createSellerUser)
  /**
   * getSellerUser
   * */
  .get(auth('admin'), validate(sellerUserValidation.getSellerUser), sellerUserController.listSellerUser);
router
  .route('/paginated')
  /**
   * getSellerUserPaginated
   * */
  .get(auth('admin'), validate(sellerUserValidation.paginatedSellerUser), sellerUserController.paginateSellerUser);
router
  .route('/:sellerUserId')
  /**
   * getSellerUserById
   * */
  .get(auth('admin'), validate(sellerUserValidation.getSellerUserById), sellerUserController.getSellerUser)
  /**
   * updateSellerUser
   * */
  .put(auth('admin'), validate(sellerUserValidation.updateSellerUser), sellerUserController.updateSellerUser)
  /**
   * deleteSellerUserById
   * */
  .delete(auth('admin'), validate(sellerUserValidation.deleteSellerUserById), sellerUserController.removeSellerUser);
export default router;
