import express from 'express';
import { productBrandController } from 'controllers/admin';
import { productBrandValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createProductBrand
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productBrandValidation.createProductBrand),
    productBrandController.createProductBrand
  )
  /**
   * getProductBrand
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productBrandValidation.getProductBrand),
    productBrandController.listProductBrand
  );
router
  .route('/paginated')
  /**
   * getProductBrandPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productBrandValidation.paginatedProductBrand),
    productBrandController.paginateProductBrand
  );
router
  .route('/:productBrandId')
  /**
   * getProductBrandById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productBrandValidation.getProductBrandById),
    productBrandController.getProductBrand
  )
  /**
   * updateProductBrand
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productBrandValidation.updateProductBrand),
    productBrandController.updateProductBrand
  )
  /**
   * deleteProductBrandById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productBrandValidation.deleteProductBrandById),
    productBrandController.removeProductBrand
  );
export default router;
