import express from 'express';
import { productTypeController } from 'controllers/admin';
import { productTypeValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createProductType
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productTypeValidation.createProductType),
    productTypeController.createProductType
  )
  /**
   * getProductType
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productTypeValidation.getProductType),
    productTypeController.listProductType
  );
router
  .route('/paginated')
  /**
   * getProductTypePaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productTypeValidation.paginatedProductType),
    productTypeController.paginateProductType
  );
router
  .route('/:productTypeId')
  /**
   * getProductTypeById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productTypeValidation.getProductTypeById),
    productTypeController.getProductType
  )
  /**
   * updateProductType
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productTypeValidation.updateProductType),
    productTypeController.updateProductType
  )
  /**
   * deleteProductTypeById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productTypeValidation.deleteProductTypeById),
    productTypeController.removeProductType
  );
export default router;
