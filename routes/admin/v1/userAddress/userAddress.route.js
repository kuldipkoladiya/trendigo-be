import express from 'express';
import { userAddressController } from 'controllers/admin';
import { userAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserAddress
   * */
  .post(auth('admin'), validate(userAddressValidation.createUserAddress), userAddressController.createUserAddress)
  /**
   * getUserAddress
   * */
  .get(auth('admin'), validate(userAddressValidation.getUserAddress), userAddressController.listUserAddress);
router
  .route('/paginated')
  /**
   * getUserAddressPaginated
   * */
  .get(auth('admin'), validate(userAddressValidation.paginatedUserAddress), userAddressController.paginateUserAddress);
router
  .route('/:userAddressId')
  /**
   * getUserAddressById
   * */
  .get(auth('admin'), validate(userAddressValidation.getUserAddressById), userAddressController.getUserAddress)
  /**
   * updateUserAddress
   * */
  .put(auth('admin'), validate(userAddressValidation.updateUserAddress), userAddressController.updateUserAddress)
  /**
   * deleteUserAddressById
   * */
  .delete(auth('admin'), validate(userAddressValidation.deleteUserAddressById), userAddressController.removeUserAddress);
export default router;
