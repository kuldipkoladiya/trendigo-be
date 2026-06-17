import express from 'express';
import { sellerPolicyController } from 'controllers/user';
import { sellerPolicyValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerPermission from 'middlewares/sellerPermission';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerPolicy
   * */
  .post(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'add'),
    validate(sellerPolicyValidation.createSellerPolicy),
    sellerPolicyController.createSellerPolicy
  )
  /**
   * getSellerPolicy
   * */
  .get(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'view'),
    validate(sellerPolicyValidation.getSellerPolicy),
    sellerPolicyController.listSellerPolicy
  );
router
  .route('/paginated')
  /**
   * getSellerPolicyPaginated
   * */
  .get(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'view'),
    validate(sellerPolicyValidation.paginatedSellerPolicy),
    sellerPolicyController.paginateSellerPolicy
  );
router
  .route('/by-store/:storeId')
  /**
   * getSellerPolicyByStoreId
   * */
  .get(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'view'),
    validate(sellerPolicyValidation.getSellerPolicyByStoreId),
    sellerPolicyController.getSellerPolicyByStoreId
  );
router
  .route('/:sellerPolicyId')
  /**
   * getSellerPolicyById
   * */
  .get(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'view'),
    validate(sellerPolicyValidation.getSellerPolicyById),
    sellerPolicyController.getSellerPolicy
  )
  /**
   * updateSellerPolicy
   * */
  .put(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'update'),
    validate(sellerPolicyValidation.updateSellerPolicy),
    sellerPolicyController.updateSellerPolicy
  )
  /**
   * deleteSellerPolicyById
   * */
  .delete(
    sellerAuth(),
    sellerPermission('sellerPolicy', 'delete'),
    validate(sellerPolicyValidation.deleteSellerPolicyById),
    sellerPolicyController.removeSellerPolicy
  );
export default router;
