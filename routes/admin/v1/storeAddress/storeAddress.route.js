import express from 'express';
import { storeAddressController } from 'controllers/admin';
import { storeAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreAddress
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeAddressValidation.createStoreAddress),
    storeAddressController.createStoreAddress
  )
  /**
   * getStoreAddress
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeAddressValidation.getStoreAddress),
    storeAddressController.listStoreAddress
  );
router
  .route('/paginated')
  /**
   * getStoreAddressPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeAddressValidation.paginatedStoreAddress),
    storeAddressController.paginateStoreAddress
  );
router
  .route('/:storeAddressId')
  /**
   * getStoreAddressById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeAddressValidation.getStoreAddressById),
    storeAddressController.getStoreAddress
  )
  /**
   * updateStoreAddress
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeAddressValidation.updateStoreAddress),
    storeAddressController.updateStoreAddress
  )
  /**
   * deleteStoreAddressById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeAddressValidation.deleteStoreAddressById),
    storeAddressController.removeStoreAddress
  );
export default router;
