import express from 'express';
import { inventoryAddressController } from 'controllers/admin';
import { inventoryAddressValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventoryAddress
   * */
  .post(
    auth('admin'),
    validate(inventoryAddressValidation.createInventoryAddress),
    inventoryAddressController.createInventoryAddress
  )
  /**
   * getInventoryAddress
   * */
  .get(
    auth('admin'),
    validate(inventoryAddressValidation.getInventoryAddress),
    inventoryAddressController.listInventoryAddress
  );
router
  .route('/paginated')
  /**
   * getInventoryAddressPaginated
   * */
  .get(
    auth('admin'),
    validate(inventoryAddressValidation.paginatedInventoryAddress),
    inventoryAddressController.paginateInventoryAddress
  );
router
  .route('/:inventoryAddressId')
  /**
   * getInventoryAddressById
   * */
  .get(
    auth('admin'),
    validate(inventoryAddressValidation.getInventoryAddressById),
    inventoryAddressController.getInventoryAddress
  )
  /**
   * updateInventoryAddress
   * */
  .put(
    auth('admin'),
    validate(inventoryAddressValidation.updateInventoryAddress),
    inventoryAddressController.updateInventoryAddress
  )
  /**
   * deleteInventoryAddressById
   * */
  .delete(
    auth('admin'),
    validate(inventoryAddressValidation.deleteInventoryAddressById),
    inventoryAddressController.removeInventoryAddress
  );
export default router;
