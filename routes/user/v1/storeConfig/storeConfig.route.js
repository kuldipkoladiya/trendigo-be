import express from 'express';
import { storeConfigController } from 'controllers/user';
import { storeConfigValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerPermission from 'middlewares/sellerPermission';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreConfig
   * */
  .post(
    sellerAuth(),
    sellerPermission('storeSettings', 'add'),
    validate(storeConfigValidation.createStoreConfig),
    storeConfigController.createStoreConfig
  )
  /**
   * getStoreConfig
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeConfigValidation.getStoreConfig),
    storeConfigController.listStoreConfig
  );
router
  .route('/paginated')
  /**
   * getStoreConfigPaginated
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeConfigValidation.paginatedStoreConfig),
    storeConfigController.paginateStoreConfig
  );
router
  .route('/:storeConfigId')
  /**
   * getStoreConfigById
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeConfigValidation.getStoreConfigById),
    storeConfigController.getStoreConfig
  )
  /**
   * updateStoreConfig
   * */
  .put(
    sellerAuth(),
    sellerPermission('storeSettings', 'update'),
    validate(storeConfigValidation.updateStoreConfig),
    storeConfigController.updateStoreConfig
  )
  /**
   * deleteStoreConfigById
   * */
  .delete(
    sellerAuth(),
    sellerPermission('storeSettings', 'delete'),
    validate(storeConfigValidation.deleteStoreConfigById),
    storeConfigController.removeStoreConfig
  );
export default router;
