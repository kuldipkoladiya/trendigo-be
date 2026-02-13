import express from 'express';
import { inventoryController } from 'controllers/user';
import { inventoryValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventory
   * */
  .post(sellerAuth(), validate(inventoryValidation.createInventory), inventoryController.createInventory)
  /**
   * getInventory
   * */
  .get(sellerAuth(), validate(inventoryValidation.getInventory), inventoryController.listInventory);
router
  .route('/paginated')
  /**
   * getInventoryPaginated
   * */
  .get(sellerAuth(), validate(inventoryValidation.paginatedInventory), inventoryController.paginateInventory);
router
  .route('/by-store/:storeId')
  /**
   * getInventoryById
   * */
  .get(sellerAuth(), validate(inventoryValidation.getInventoryBystoreId), inventoryController.getInventoryBystoreId);
router
  .route('/:inventoryId')
  /**
   * getInventoryById
   * */
  .get(sellerAuth(), validate(inventoryValidation.getInventoryById), inventoryController.getInventory)
  /**
   * updateInventory
   * */
  .put(sellerAuth(), validate(inventoryValidation.updateInventory), inventoryController.updateInventory)
  /**
   * deleteInventoryById
   * */
  .delete(sellerAuth(), validate(inventoryValidation.deleteInventoryById), inventoryController.removeInventory);
export default router;
