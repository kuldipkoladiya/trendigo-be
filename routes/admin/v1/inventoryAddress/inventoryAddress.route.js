import express from 'express';
import { inventoryAddressController } from 'controllers/admin';
import { inventoryAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createInventoryAddress
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryAddressValidation.createInventoryAddress),
    inventoryAddressController.createInventoryAddress
  )
  /**
   * getInventoryAddress
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryAddressValidation.getInventoryAddress),
    inventoryAddressController.listInventoryAddress
  );
router
  .route('/paginated')
  /**
   * getInventoryAddressPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryAddressValidation.paginatedInventoryAddress),
    inventoryAddressController.paginateInventoryAddress
  );
router
  .route('/:inventoryAddressId')
  /**
   * getInventoryAddressById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryAddressValidation.getInventoryAddressById),
    inventoryAddressController.getInventoryAddress
  )
  /**
   * updateInventoryAddress
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryAddressValidation.updateInventoryAddress),
    inventoryAddressController.updateInventoryAddress
  )
  /**
   * deleteInventoryAddressById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryAddressValidation.deleteInventoryAddressById),
    inventoryAddressController.removeInventoryAddress
  );
export default router;
