import express from 'express';
import { productCategoriesController } from 'controllers/admin';
import { productCategoriesValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createProductCategories
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productCategoriesValidation.createProductCategories),
    productCategoriesController.createProductCategories
  )
  /**
   * getProductCategories
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productCategoriesValidation.getProductCategories),
    productCategoriesController.listProductCategories
  );
router
  .route('/paginated')
  /**
   * getProductCategoriesPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productCategoriesValidation.paginatedProductCategories),
    productCategoriesController.paginateProductCategories
  );
router
  .route('/:productCategoriesId')
  /**
   * getProductCategoriesById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productCategoriesValidation.getProductCategoriesById),
    productCategoriesController.getProductCategories
  )
  /**
   * updateProductCategories
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productCategoriesValidation.updateProductCategories),
    productCategoriesController.updateProductCategories
  )
  /**
   * deleteProductCategoriesById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productCategoriesValidation.deleteProductCategoriesById),
    productCategoriesController.removeProductCategories
  );
export default router;
