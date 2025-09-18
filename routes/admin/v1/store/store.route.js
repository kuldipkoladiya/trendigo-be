import express from 'express';
import { storeController } from 'controllers/admin';
import { storeValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStore
   * */
  .post(auth('admin'), validate(storeValidation.createStore), storeController.createStore)
  /**
   * getStore
   * */
  .get(auth('admin'), validate(storeValidation.getStore), storeController.listStore);
router
  .route('/paginated')
  /**
   * getStorePaginated
   * */
  .get(auth('admin'), validate(storeValidation.paginatedStore), storeController.paginateStore);
router
  .route('/:storeId')
  /**
   * getStoreById
   * */
  .get(auth('admin'), validate(storeValidation.getStoreById), storeController.getStore)
  /**
   * updateStore
   * */
  .put(auth('admin'), validate(storeValidation.updateStore), storeController.updateStore)
  /**
   * deleteStoreById
   * */
  .delete(auth('admin'), validate(storeValidation.deleteStoreById), storeController.removeStore);
export default router;
