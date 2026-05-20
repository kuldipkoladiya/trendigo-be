import express from 'express';
import { userAddressController } from 'controllers/admin';
import { userAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createUserAddress
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userAddressValidation.createUserAddress),
    userAddressController.createUserAddress
  )
  /**
   * getUserAddress
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userAddressValidation.getUserAddress),
    userAddressController.listUserAddress
  );
router
  .route('/paginated')
  /**
   * getUserAddressPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userAddressValidation.paginatedUserAddress),
    userAddressController.paginateUserAddress
  );
router
  .route('/:userAddressId')
  /**
   * getUserAddressById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userAddressValidation.getUserAddressById),
    userAddressController.getUserAddress
  )
  /**
   * updateUserAddress
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userAddressValidation.updateUserAddress),
    userAddressController.updateUserAddress
  )
  /**
   * deleteUserAddressById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userAddressValidation.deleteUserAddressById),
    userAddressController.removeUserAddress
  );
export default router;
