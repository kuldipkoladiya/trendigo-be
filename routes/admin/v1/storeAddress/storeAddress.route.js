import express from 'express';
import { storeAddressController } from 'controllers/admin';
import { storeAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreAddress
   * */
  .post(auth('admin'), validate(storeAddressValidation.createStoreAddress), storeAddressController.createStoreAddress)
  /**
   * getStoreAddress
   * */
  .get(auth('admin'), validate(storeAddressValidation.getStoreAddress), storeAddressController.listStoreAddress);
router
  .route('/paginated')
  /**
   * getStoreAddressPaginated
   * */
  .get(auth('admin'), validate(storeAddressValidation.paginatedStoreAddress), storeAddressController.paginateStoreAddress);
router
  .route('/:storeAddressId')
  /**
   * getStoreAddressById
   * */
  .get(auth('admin'), validate(storeAddressValidation.getStoreAddressById), storeAddressController.getStoreAddress)
  /**
   * updateStoreAddress
   * */
  .put(auth('admin'), validate(storeAddressValidation.updateStoreAddress), storeAddressController.updateStoreAddress)
  /**
   * deleteStoreAddressById
   * */
  .delete(auth('admin'), validate(storeAddressValidation.deleteStoreAddressById), storeAddressController.removeStoreAddress);
export default router;
