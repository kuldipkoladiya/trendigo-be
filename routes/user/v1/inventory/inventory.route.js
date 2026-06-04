import express from 'express';
import { inventoryController } from 'controllers/user';
import { inventoryValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerPermission from 'middlewares/sellerPermission';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventory
   * */
  .post(
    sellerAuth(),
    sellerPermission('inventory', 'add'),
    validate(inventoryValidation.createInventory),
    inventoryController.createInventory
  )
  /**
   * getInventory
   * */
  .get(
    sellerAuth(),
    sellerPermission('inventory', 'view'),
    validate(inventoryValidation.getInventory),
    inventoryController.listInventory
  );
router
  .route('/paginated')
  /**
   * getInventoryPaginated
   * */
  .get(
    sellerAuth(),
    sellerPermission('inventory', 'view'),
    validate(inventoryValidation.paginatedInventory),
    inventoryController.paginateInventory
  );
router
  .route('/by-store/:storeId')
  /**
   * getInventoryById
   * */
  .get(
    sellerAuth(),
    sellerPermission('inventory', 'view'),
    validate(inventoryValidation.getInventoryBystoreId),
    inventoryController.getInventoryBystoreId
  );
router
  .route('/:inventoryId')
  /**
   * getInventoryById
   * */
  .get(
    sellerAuth(),
    sellerPermission('inventory', 'view'),
    validate(inventoryValidation.getInventoryById),
    inventoryController.getInventory
  )
  /**
   * updateInventory
   * */
  .put(
    sellerAuth(),
    sellerPermission('inventory', 'update'),
    validate(inventoryValidation.updateInventory),
    inventoryController.updateInventory
  )
  /**
   * deleteInventoryById
   * */
  .delete(
    sellerAuth(),
    sellerPermission('inventory', 'delete'),
    validate(inventoryValidation.deleteInventoryById),
    inventoryController.removeInventory
  );
export default router;
