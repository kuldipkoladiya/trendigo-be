import express from 'express';
import { sellerPolicyController } from 'controllers/user';
import { sellerPolicyValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerPolicy
   * */
  .post(sellerAuth(), validate(sellerPolicyValidation.createSellerPolicy), sellerPolicyController.createSellerPolicy)
  /**
   * getSellerPolicy
   * */
  .get(sellerAuth(), validate(sellerPolicyValidation.getSellerPolicy), sellerPolicyController.listSellerPolicy);
router
  .route('/paginated')
  /**
   * getSellerPolicyPaginated
   * */
  .get(sellerAuth(), validate(sellerPolicyValidation.paginatedSellerPolicy), sellerPolicyController.paginateSellerPolicy);
router
  .route('/by-store/:storeId')
  /**
   * getSellerPolicyByStoreId
   * */
  .get(
    sellerAuth(),
    validate(sellerPolicyValidation.getSellerPolicyByStoreId),
    sellerPolicyController.getSellerPolicyByStoreId
  );
router
  .route('/:sellerPolicyId')
  /**
   * getSellerPolicyById
   * */
  .get(sellerAuth(), validate(sellerPolicyValidation.getSellerPolicyById), sellerPolicyController.getSellerPolicy)
  /**
   * updateSellerPolicy
   * */
  .put(sellerAuth(), validate(sellerPolicyValidation.updateSellerPolicy), sellerPolicyController.updateSellerPolicy)
  /**
   * deleteSellerPolicyById
   * */
  .delete(sellerAuth(), validate(sellerPolicyValidation.deleteSellerPolicyById), sellerPolicyController.removeSellerPolicy);
export default router;
