import express from 'express';
import { storeController } from 'controllers/user';
import { storeValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStore
   * */
  .post(auth('user'), validate(storeValidation.createStore), storeController.createStore)
  /**
   * getStore
   * */
  .get(auth('user'), validate(storeValidation.getStore), storeController.listStore);
router
  .route('/paginated')
  /**
   * getStorePaginated
   * */
  .get(auth('user'), validate(storeValidation.paginatedStore), storeController.paginateStore);
router
  .route('/:storeId')
  /**
   * getStoreById
   * */
  .get(auth('user'), validate(storeValidation.getStoreById), storeController.getStore)
  /**
   * updateStore
   * */
  .put(auth('user'), validate(storeValidation.updateStore), storeController.updateStore)
  /**
   * deleteStoreById
   * */
  .delete(auth('user'), validate(storeValidation.deleteStoreById), storeController.removeStore);
export default router;
