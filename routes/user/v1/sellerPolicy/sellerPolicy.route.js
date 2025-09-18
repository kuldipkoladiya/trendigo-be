import express from 'express';
import { sellerPolicyController } from 'controllers/user';
import { sellerPolicyValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerPolicy
   * */
  .post(auth('user'), validate(sellerPolicyValidation.createSellerPolicy), sellerPolicyController.createSellerPolicy)
  /**
   * getSellerPolicy
   * */
  .get(auth('user'), validate(sellerPolicyValidation.getSellerPolicy), sellerPolicyController.listSellerPolicy);
router
  .route('/paginated')
  /**
   * getSellerPolicyPaginated
   * */
  .get(auth('user'), validate(sellerPolicyValidation.paginatedSellerPolicy), sellerPolicyController.paginateSellerPolicy);
router
  .route('/:sellerPolicyId')
  /**
   * getSellerPolicyById
   * */
  .get(auth('user'), validate(sellerPolicyValidation.getSellerPolicyById), sellerPolicyController.getSellerPolicy)
  /**
   * updateSellerPolicy
   * */
  .put(auth('user'), validate(sellerPolicyValidation.updateSellerPolicy), sellerPolicyController.updateSellerPolicy)
  /**
   * deleteSellerPolicyById
   * */
  .delete(auth('user'), validate(sellerPolicyValidation.deleteSellerPolicyById), sellerPolicyController.removeSellerPolicy);
export default router;
