import express from 'express';
import { storeAddressController } from 'controllers/user';
import { storeAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreAddress
   * */
  .post(sellerAuth(), validate(storeAddressValidation.createStoreAddress), storeAddressController.createStoreAddress)
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
  .get(sellerAuth(), validate(storeAddressValidation.getStoreAddressById), storeAddressController.getStoreAddress)
  /**
   * updateStoreAddress
   * */
  .put(sellerAuth(), validate(storeAddressValidation.updateStoreAddress), storeAddressController.updateStoreAddress)
  /**
   * deleteStoreAddressById
   * */
  .delete(auth('user'), validate(storeAddressValidation.deleteStoreAddressById), storeAddressController.removeStoreAddress);
export default router;
