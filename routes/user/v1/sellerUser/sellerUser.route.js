import express from 'express';
import { sellerUserController } from 'controllers/user';
import { sellerUserValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from 'middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerUser
   * */
  .post(sellerAuth(), validate(sellerUserValidation.createSellerUser), sellerUserController.createSellerUser)
  /**
   * getSellerUser
   * */
  .get(sellerAuth(), validate(sellerUserValidation.getSellerUser), sellerUserController.listSellerUser);
router
  .route('/paginated')
  /**
   * getSellerUserPaginated
   * */
  .get(sellerAuth(), validate(sellerUserValidation.paginatedSellerUser), sellerUserController.paginateSellerUser);
router
  .route('/:sellerUserId')
  /**
   * getSellerUserById
   * */
  .get(sellerAuth(), validate(sellerUserValidation.getSellerUserById), sellerUserController.getSellerUser)
  /**
   * updateSellerUser
   * */
  .put(sellerAuth(), validate(sellerUserValidation.updateSellerUser), sellerUserController.updateSellerUser)
  /**
   * deleteSellerUserById
   * */
  .delete(sellerAuth(), validate(sellerUserValidation.deleteSellerUserById), sellerUserController.removeSellerUser);
export default router;
