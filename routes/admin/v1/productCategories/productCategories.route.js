import express from 'express';
import { productCategoriesController } from 'controllers/admin';
import { productCategoriesValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductCategories
   * */
  .post(
    auth('admin'),
    validate(productCategoriesValidation.createProductCategories),
    productCategoriesController.createProductCategories
  )
  /**
   * getProductCategories
   * */
  .get(
    auth('admin'),
    validate(productCategoriesValidation.getProductCategories),
    productCategoriesController.listProductCategories
  );
router
  .route('/paginated')
  /**
   * getProductCategoriesPaginated
   * */
  .get(
    auth('admin'),
    validate(productCategoriesValidation.paginatedProductCategories),
    productCategoriesController.paginateProductCategories
  );
router
  .route('/:productCategoriesId')
  /**
   * getProductCategoriesById
   * */
  .get(
    auth('admin'),
    validate(productCategoriesValidation.getProductCategoriesById),
    productCategoriesController.getProductCategories
  )
  /**
   * updateProductCategories
   * */
  .put(
    auth('admin'),
    validate(productCategoriesValidation.updateProductCategories),
    productCategoriesController.updateProductCategories
  )
  /**
   * deleteProductCategoriesById
   * */
  .delete(
    auth('admin'),
    validate(productCategoriesValidation.deleteProductCategoriesById),
    productCategoriesController.removeProductCategories
  );
export default router;
