import express from 'express';
import { storeConfigController } from 'controllers/user';
import { storeConfigValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreConfig
   * */
  .post(auth('user'), validate(storeConfigValidation.createStoreConfig), storeConfigController.createStoreConfig)
  /**
   * getStoreConfig
   * */
  .get(auth('user'), validate(storeConfigValidation.getStoreConfig), storeConfigController.listStoreConfig);
router
  .route('/paginated')
  /**
   * getStoreConfigPaginated
   * */
  .get(auth('user'), validate(storeConfigValidation.paginatedStoreConfig), storeConfigController.paginateStoreConfig);
router
  .route('/:storeConfigId')
  /**
   * getStoreConfigById
   * */
  .get(auth('user'), validate(storeConfigValidation.getStoreConfigById), storeConfigController.getStoreConfig)
  /**
   * updateStoreConfig
   * */
  .put(auth('user'), validate(storeConfigValidation.updateStoreConfig), storeConfigController.updateStoreConfig)
  /**
   * deleteStoreConfigById
   * */
  .delete(auth('user'), validate(storeConfigValidation.deleteStoreConfigById), storeConfigController.removeStoreConfig);
export default router;
