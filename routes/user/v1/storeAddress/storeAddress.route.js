import express from 'express';
import { storeAddressController } from 'controllers/user';
import { storeAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreAddress
   * */
  .post(auth('user'), validate(storeAddressValidation.createStoreAddress), storeAddressController.createStoreAddress)
  /**
   * getStoreAddress
   * */
  .get(auth('user'), validate(storeAddressValidation.getStoreAddress), storeAddressController.listStoreAddress);
router
  .route('/paginated')
  /**
   * getStoreAddressPaginated
   * */
  .get(auth('user'), validate(storeAddressValidation.paginatedStoreAddress), storeAddressController.paginateStoreAddress);
router
  .route('/:storeAddressId')
  /**
   * getStoreAddressById
   * */
  .get(auth('user'), validate(storeAddressValidation.getStoreAddressById), storeAddressController.getStoreAddress)
  /**
   * updateStoreAddress
   * */
  .put(auth('user'), validate(storeAddressValidation.updateStoreAddress), storeAddressController.updateStoreAddress)
  /**
   * deleteStoreAddressById
   * */
  .delete(auth('user'), validate(storeAddressValidation.deleteStoreAddressById), storeAddressController.removeStoreAddress);
export default router;
