import express from 'express';
import { pickupAddressController } from 'controllers/admin';
import { pickupAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createPickupAddress
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(pickupAddressValidation.createPickupAddress),
    pickupAddressController.createPickupAddress
  )
  /**
   * getPickupAddress
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(pickupAddressValidation.getPickupAddress),
    pickupAddressController.listPickupAddress
  );
router
  .route('/paginated')
  /**
   * getPickupAddressPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(pickupAddressValidation.paginatedPickupAddress),
    pickupAddressController.paginatePickupAddress
  );
router
  .route('/:pickupAddressId')
  /**
   * getPickupAddressById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(pickupAddressValidation.getPickupAddressById),
    pickupAddressController.getPickupAddress
  )
  /**
   * updatePickupAddress
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(pickupAddressValidation.updatePickupAddress),
    pickupAddressController.updatePickupAddress
  )
  /**
   * deletePickupAddressById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(pickupAddressValidation.deletePickupAddressById),
    pickupAddressController.removePickupAddress
  );
export default router;
