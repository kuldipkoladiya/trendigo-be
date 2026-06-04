import express from 'express';
import { storeController } from 'controllers/user';
import { storeValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from 'middlewares/sellerAuth';
import sellerPermission from 'middlewares/sellerPermission';

const router = express.Router();
router
  .route('/')
  /**
   * createStore
   * */
  .post(
    sellerAuth(),
    sellerPermission('storeSettings', 'add'),
    validate(storeValidation.createStore),
    storeController.createStore
  )
  /**
   * getStore
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeValidation.getStore),
    storeController.listStore
  );
router
  .route('/paginated')
  /**
   * getStorePaginated
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeValidation.paginatedStore),
    storeController.paginateStore
  );
router
  .route('/by-storeId/:storeId')
  /**
   * getStoreById
   * */
  .get(validate(storeValidation.getStoreById), storeController.getStorebyid);
router
  .route('/:storeId')
  /**
   * getStoreById
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeValidation.getStoreById),
    storeController.getStorebyid
  )
  /**
   * updateStore
   * */
  .put(
    sellerAuth(),
    sellerPermission('storeSettings', 'update'),
    validate(storeValidation.updateStore),
    storeController.updateStore
  )
  /**
   * deleteStoreById
   * */
  .delete(
    sellerAuth(),
    sellerPermission('storeSettings', 'delete'),
    validate(storeValidation.deleteStoreById),
    storeController.removeStore
  );
router
  .route('/get-seller/:contact')
  /**
   * getStoreById
   * */
  .get(
    sellerAuth(),
    sellerPermission('storeSettings', 'view'),
    validate(storeValidation.StoreBySelleId),
    storeController.getStore
  );
export default router;
