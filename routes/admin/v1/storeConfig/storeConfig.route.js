import express from 'express';
import { storeConfigController } from 'controllers/admin';
import { storeConfigValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreConfig
   * */
  .post(auth('admin'), validate(storeConfigValidation.createStoreConfig), storeConfigController.createStoreConfig)
  /**
   * getStoreConfig
   * */
  .get(auth('admin'), validate(storeConfigValidation.getStoreConfig), storeConfigController.listStoreConfig);
router
  .route('/paginated')
  /**
   * getStoreConfigPaginated
   * */
  .get(auth('admin'), validate(storeConfigValidation.paginatedStoreConfig), storeConfigController.paginateStoreConfig);
router
  .route('/:storeConfigId')
  /**
   * getStoreConfigById
   * */
  .get(auth('admin'), validate(storeConfigValidation.getStoreConfigById), storeConfigController.getStoreConfig)
  /**
   * updateStoreConfig
   * */
  .put(auth('admin'), validate(storeConfigValidation.updateStoreConfig), storeConfigController.updateStoreConfig)
  /**
   * deleteStoreConfigById
   * */
  .delete(auth('admin'), validate(storeConfigValidation.deleteStoreConfigById), storeConfigController.removeStoreConfig);
export default router;
