import express from 'express';
import { inventoryController } from 'controllers/user';
import { inventoryValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventory
   * */
  .post(auth('user'), validate(inventoryValidation.createInventory), inventoryController.createInventory)
  /**
   * getInventory
   * */
  .get(auth('user'), validate(inventoryValidation.getInventory), inventoryController.listInventory);
router
  .route('/paginated')
  /**
   * getInventoryPaginated
   * */
  .get(auth('user'), validate(inventoryValidation.paginatedInventory), inventoryController.paginateInventory);
router
  .route('/:inventoryId')
  /**
   * getInventoryById
   * */
  .get(auth('user'), validate(inventoryValidation.getInventoryById), inventoryController.getInventory)
  /**
   * updateInventory
   * */
  .put(auth('user'), validate(inventoryValidation.updateInventory), inventoryController.updateInventory)
  /**
   * deleteInventoryById
   * */
  .delete(auth('user'), validate(inventoryValidation.deleteInventoryById), inventoryController.removeInventory);
export default router;
