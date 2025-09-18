import express from 'express';
import { pickupAddressController } from 'controllers/user';
import { pickupAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createPickupAddress
   * */
  .post(auth('user'), validate(pickupAddressValidation.createPickupAddress), pickupAddressController.createPickupAddress)
  /**
   * getPickupAddress
   * */
  .get(auth('user'), validate(pickupAddressValidation.getPickupAddress), pickupAddressController.listPickupAddress);
router
  .route('/paginated')
  /**
   * getPickupAddressPaginated
   * */
  .get(
    auth('user'),
    validate(pickupAddressValidation.paginatedPickupAddress),
    pickupAddressController.paginatePickupAddress
  );
router
  .route('/:pickupAddressId')
  /**
   * getPickupAddressById
   * */
  .get(auth('user'), validate(pickupAddressValidation.getPickupAddressById), pickupAddressController.getPickupAddress)
  /**
   * updatePickupAddress
   * */
  .put(auth('user'), validate(pickupAddressValidation.updatePickupAddress), pickupAddressController.updatePickupAddress)
  /**
   * deletePickupAddressById
   * */
  .delete(
    auth('user'),
    validate(pickupAddressValidation.deletePickupAddressById),
    pickupAddressController.removePickupAddress
  );
export default router;
