import express from 'express';
import { pickupAddressController } from 'controllers/user';
import { pickupAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from 'middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createPickupAddress
   * */
  .post(sellerAuth(), validate(pickupAddressValidation.createPickupAddress), pickupAddressController.createPickupAddress)
  /**
   * getPickupAddress
   * */
  .get(sellerAuth(), validate(pickupAddressValidation.getPickupAddress), pickupAddressController.listPickupAddress);
router
  .route('/paginated')
  /**
   * getPickupAddressPaginated
   * */
  .get(
    sellerAuth(),
    validate(pickupAddressValidation.paginatedPickupAddress),
    pickupAddressController.paginatePickupAddress
  );
router
  .route('/:pickupAddressId')
  /**
   * getPickupAddressById
   * */
  .get(sellerAuth(), validate(pickupAddressValidation.getPickupAddressById), pickupAddressController.getPickupAddress)
  /**
   * updatePickupAddress
   * */
  .put(sellerAuth(), validate(pickupAddressValidation.updatePickupAddress), pickupAddressController.updatePickupAddress)
  /**
   * deletePickupAddressById
   * */
  .delete(
    sellerAuth(),
    validate(pickupAddressValidation.deletePickupAddressById),
    pickupAddressController.removePickupAddress
  );
export default router;
