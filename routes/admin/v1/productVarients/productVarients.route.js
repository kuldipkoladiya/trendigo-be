import express from 'express';
import { productVarientsController } from 'controllers/admin';
import { productVarientsValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarients
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientsValidation.createProductVarients),
    productVarientsController.createProductVarients
  )
  /**
   * getProductVarients
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientsValidation.getProductVarients),
    productVarientsController.listProductVarients
  );
router
  .route('/paginated')
  /**
   * getProductVarientsPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientsValidation.paginatedProductVarients),
    productVarientsController.paginateProductVarients
  );
router
  .route('/:productVarientsId')
  /**
   * getProductVarientsById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientsValidation.getProductVarientsById),
    productVarientsController.getProductVarients
  )
  /**
   * updateProductVarients
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientsValidation.updateProductVarients),
    productVarientsController.updateProductVarients
  )
  /**
   * deleteProductVarientsById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productVarientsValidation.deleteProductVarientsById),
    productVarientsController.removeProductVarients
  );
export default router;
