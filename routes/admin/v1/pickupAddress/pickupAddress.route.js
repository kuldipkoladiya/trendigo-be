import express from 'express';
import { pickupAddressController } from 'controllers/admin';
import { pickupAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createPickupAddress
   * */
  .post(auth('admin'), validate(pickupAddressValidation.createPickupAddress), pickupAddressController.createPickupAddress)
  /**
   * getPickupAddress
   * */
  .get(auth('admin'), validate(pickupAddressValidation.getPickupAddress), pickupAddressController.listPickupAddress);
router
  .route('/paginated')
  /**
   * getPickupAddressPaginated
   * */
  .get(
    auth('admin'),
    validate(pickupAddressValidation.paginatedPickupAddress),
    pickupAddressController.paginatePickupAddress
  );
router
  .route('/:pickupAddressId')
  /**
   * getPickupAddressById
   * */
  .get(auth('admin'), validate(pickupAddressValidation.getPickupAddressById), pickupAddressController.getPickupAddress)
  /**
   * updatePickupAddress
   * */
  .put(auth('admin'), validate(pickupAddressValidation.updatePickupAddress), pickupAddressController.updatePickupAddress)
  /**
   * deletePickupAddressById
   * */
  .delete(
    auth('admin'),
    validate(pickupAddressValidation.deletePickupAddressById),
    pickupAddressController.removePickupAddress
  );
export default router;
