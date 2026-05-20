import express from 'express';
import { sellerPolicyController } from 'controllers/admin';
import { sellerPolicyValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerPolicy
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerPolicyValidation.createSellerPolicy),
    sellerPolicyController.createSellerPolicy
  )
  /**
   * getSellerPolicy
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerPolicyValidation.getSellerPolicy),
    sellerPolicyController.listSellerPolicy
  );
router
  .route('/paginated')
  /**
   * getSellerPolicyPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerPolicyValidation.paginatedSellerPolicy),
    sellerPolicyController.paginateSellerPolicy
  );
router
  .route('/:sellerPolicyId')
  /**
   * getSellerPolicyById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerPolicyValidation.getSellerPolicyById),
    sellerPolicyController.getSellerPolicy
  )
  /**
   * updateSellerPolicy
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerPolicyValidation.updateSellerPolicy),
    sellerPolicyController.updateSellerPolicy
  )
  /**
   * deleteSellerPolicyById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerPolicyValidation.deleteSellerPolicyById),
    sellerPolicyController.removeSellerPolicy
  );
export default router;
