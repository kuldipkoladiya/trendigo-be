import express from 'express';
import { sellerPolicyController } from 'controllers/admin';
import { sellerPolicyValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerPolicy
   * */
  .post(auth('admin'), validate(sellerPolicyValidation.createSellerPolicy), sellerPolicyController.createSellerPolicy)
  /**
   * getSellerPolicy
   * */
  .get(auth('admin'), validate(sellerPolicyValidation.getSellerPolicy), sellerPolicyController.listSellerPolicy);
router
  .route('/paginated')
  /**
   * getSellerPolicyPaginated
   * */
  .get(auth('admin'), validate(sellerPolicyValidation.paginatedSellerPolicy), sellerPolicyController.paginateSellerPolicy);
router
  .route('/:sellerPolicyId')
  /**
   * getSellerPolicyById
   * */
  .get(auth('admin'), validate(sellerPolicyValidation.getSellerPolicyById), sellerPolicyController.getSellerPolicy)
  /**
   * updateSellerPolicy
   * */
  .put(auth('admin'), validate(sellerPolicyValidation.updateSellerPolicy), sellerPolicyController.updateSellerPolicy)
  /**
   * deleteSellerPolicyById
   * */
  .delete(auth('admin'), validate(sellerPolicyValidation.deleteSellerPolicyById), sellerPolicyController.removeSellerPolicy);
export default router;
