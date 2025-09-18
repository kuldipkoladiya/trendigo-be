import express from 'express';
import { inventoryAddressController } from 'controllers/user';
import { inventoryAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventoryAddress
   * */
  .post(
    auth('user'),
    validate(inventoryAddressValidation.createInventoryAddress),
    inventoryAddressController.createInventoryAddress
  )
  /**
   * getInventoryAddress
   * */
  .get(
    auth('user'),
    validate(inventoryAddressValidation.getInventoryAddress),
    inventoryAddressController.listInventoryAddress
  );
router
  .route('/paginated')
  /**
   * getInventoryAddressPaginated
   * */
  .get(
    auth('user'),
    validate(inventoryAddressValidation.paginatedInventoryAddress),
    inventoryAddressController.paginateInventoryAddress
  );
router
  .route('/:inventoryAddressId')
  /**
   * getInventoryAddressById
   * */
  .get(
    auth('user'),
    validate(inventoryAddressValidation.getInventoryAddressById),
    inventoryAddressController.getInventoryAddress
  )
  /**
   * updateInventoryAddress
   * */
  .put(
    auth('user'),
    validate(inventoryAddressValidation.updateInventoryAddress),
    inventoryAddressController.updateInventoryAddress
  )
  /**
   * deleteInventoryAddressById
   * */
  .delete(
    auth('user'),
    validate(inventoryAddressValidation.deleteInventoryAddressById),
    inventoryAddressController.removeInventoryAddress
  );
export default router;
