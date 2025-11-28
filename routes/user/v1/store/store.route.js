import express from 'express';
import { storeController } from 'controllers/user';
import { storeValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from 'middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createStore
   * */
  .post(sellerAuth(), validate(storeValidation.createStore), storeController.createStore)
  /**
   * getStore
   * */
  .get(sellerAuth(), validate(storeValidation.getStore), storeController.listStore);
router
  .route('/paginated')
  /**
   * getStorePaginated
   * */
  .get(sellerAuth(), validate(storeValidation.paginatedStore), storeController.paginateStore);
router
  .route('/:storeId')
  /**
   * getStoreById
   * */
  .get(sellerAuth(), validate(storeValidation.getStoreById), storeController.getStore)
  /**
   * updateStore
   * */
  .put(sellerAuth(), validate(storeValidation.updateStore), storeController.updateStore)
  /**
   * deleteStoreById
   * */
  .delete(sellerAuth(), validate(storeValidation.deleteStoreById), storeController.removeStore);
export default router;
