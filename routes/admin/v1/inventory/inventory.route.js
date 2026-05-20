import express from 'express';
import { inventoryController } from 'controllers/admin';
import { inventoryValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createInventory
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryValidation.createInventory),
    inventoryController.createInventory
  )
  /**
   * getInventory
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryValidation.getInventory),
    inventoryController.listInventory
  );
router
  .route('/paginated')
  /**
   * getInventoryPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryValidation.paginatedInventory),
    inventoryController.paginateInventory
  );
router
  .route('/:inventoryId')
  /**
   * getInventoryById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryValidation.getInventoryById),
    inventoryController.getInventory
  )
  /**
   * updateInventory
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryValidation.updateInventory),
    inventoryController.updateInventory
  )
  /**
   * deleteInventoryById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(inventoryValidation.deleteInventoryById),
    inventoryController.removeInventory
  );
export default router;
