import express from 'express';
import { userAddressController } from 'controllers/user';
import { userAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserAddress
   * */
  .post(auth('user'), validate(userAddressValidation.createUserAddress), userAddressController.createUserAddress)
  /**
   * getUserAddress
   * */
  .get(auth('user'), validate(userAddressValidation.getUserAddress), userAddressController.listUserAddress);
router
  .route('/paginated')
  /**
   * getUserAddressPaginated
   * */
  .get(auth('user'), validate(userAddressValidation.paginatedUserAddress), userAddressController.paginateUserAddress);
router
  .route('/:userAddressId')
  /**
   * getUserAddressById
   * */
  .get(auth('user'), validate(userAddressValidation.getUserAddressById), userAddressController.getUserAddress)
  /**
   * updateUserAddress
   * */
  .put(auth('user'), validate(userAddressValidation.updateUserAddress), userAddressController.updateUserAddress)
  /**
   * deleteUserAddressById
   * */
  .delete(auth('user'), validate(userAddressValidation.deleteUserAddressById), userAddressController.removeUserAddress);
export default router;
