import express from 'express';
import { inventoryController } from 'controllers/admin';
import { inventoryValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventory
   * */
  .post(auth('admin'), validate(inventoryValidation.createInventory), inventoryController.createInventory)
  /**
   * getInventory
   * */
  .get(auth('admin'), validate(inventoryValidation.getInventory), inventoryController.listInventory);
router
  .route('/paginated')
  /**
   * getInventoryPaginated
   * */
  .get(auth('admin'), validate(inventoryValidation.paginatedInventory), inventoryController.paginateInventory);
router
  .route('/:inventoryId')
  /**
   * getInventoryById
   * */
  .get(auth('admin'), validate(inventoryValidation.getInventoryById), inventoryController.getInventory)
  /**
   * updateInventory
   * */
  .put(auth('admin'), validate(inventoryValidation.updateInventory), inventoryController.updateInventory)
  /**
   * deleteInventoryById
   * */
  .delete(auth('admin'), validate(inventoryValidation.deleteInventoryById), inventoryController.removeInventory);
export default router;
