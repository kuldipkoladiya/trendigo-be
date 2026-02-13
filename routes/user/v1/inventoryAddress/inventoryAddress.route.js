import express from 'express';
import { inventoryAddressController } from 'controllers/user';
import { inventoryAddressValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createInventoryAddress
   * */
  .post(
    sellerAuth(),
    validate(inventoryAddressValidation.createInventoryAddress),
    inventoryAddressController.createInventoryAddress
  )
  /**
   * getInventoryAddress
   * */
  .get(
    sellerAuth(),
    validate(inventoryAddressValidation.getInventoryAddress),
    inventoryAddressController.listInventoryAddress
  );
router
  .route('/paginated')
  /**
   * getInventoryAddressPaginated
   * */
  .get(
    sellerAuth(),
    validate(inventoryAddressValidation.paginatedInventoryAddress),
    inventoryAddressController.paginateInventoryAddress
  );
router
  .route('/:inventoryAddressId')
  /**
   * getInventoryAddressById
   * */
  .get(
    sellerAuth(),
    validate(inventoryAddressValidation.getInventoryAddressById),
    inventoryAddressController.getInventoryAddress
  )
  /**
   * updateInventoryAddress
   * */
  .put(
    sellerAuth(),
    validate(inventoryAddressValidation.updateInventoryAddress),
    inventoryAddressController.updateInventoryAddress
  )
  /**
   * deleteInventoryAddressById
   * */
  .delete(
    sellerAuth(),
    validate(inventoryAddressValidation.deleteInventoryAddressById),
    inventoryAddressController.removeInventoryAddress
  );
export default router;
