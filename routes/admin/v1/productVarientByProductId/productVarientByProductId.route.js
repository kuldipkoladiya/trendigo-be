import express from 'express';
import { productVarientByProductIdController } from 'controllers/admin';
import { productVarientByProductIdValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarientByProductId
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientByProductIdValidation.createProductVarientByProductId),
    productVarientByProductIdController.createProductVarientByProductId
  )
  /**
   * getProductVarientByProductId
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientByProductIdValidation.getProductVarientByProductId),
    productVarientByProductIdController.listProductVarientByProductId
  );
router
  .route('/paginated')
  /**
   * getProductVarientByProductIdPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientByProductIdValidation.paginatedProductVarientByProductId),
    productVarientByProductIdController.paginateProductVarientByProductId
  );
router
  .route('/:productVarientByProductIdId')
  /**
   * getProductVarientByProductIdById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientByProductIdValidation.getProductVarientByProductIdById),
    productVarientByProductIdController.getProductVarientByProductId
  )
  /**
   * updateProductVarientByProductId
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientByProductIdValidation.updateProductVarientByProductId),
    productVarientByProductIdController.updateProductVarientByProductId
  )
  /**
   * deleteProductVarientByProductIdById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientByProductIdValidation.deleteProductVarientByProductIdById),
    productVarientByProductIdController.removeProductVarientByProductId
  );
export default router;
