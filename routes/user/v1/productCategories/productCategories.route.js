import express from 'express';
import { productCategoriesController } from 'controllers/user';
import { productCategoriesValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductCategories
   * */
  .post(
    auth('user'),
    validate(productCategoriesValidation.createProductCategories),
    productCategoriesController.createProductCategories
  )
  /**
   * getProductCategories
   * */
  .get(
    auth('user'),
    validate(productCategoriesValidation.getProductCategories),
    productCategoriesController.listProductCategories
  );
router
  .route('/paginated')
  /**
   * getProductCategoriesPaginated
   * */
  .get(
    auth('user'),
    validate(productCategoriesValidation.paginatedProductCategories),
    productCategoriesController.paginateProductCategories
  );
router
  .route('/:productCategoriesId')
  /**
   * getProductCategoriesById
   * */
  .get(
    auth('user'),
    validate(productCategoriesValidation.getProductCategoriesById),
    productCategoriesController.getProductCategories
  )
  /**
   * updateProductCategories
   * */
  .put(
    auth('user'),
    validate(productCategoriesValidation.updateProductCategories),
    productCategoriesController.updateProductCategories
  )
  /**
   * deleteProductCategoriesById
   * */
  .delete(
    auth('user'),
    validate(productCategoriesValidation.deleteProductCategoriesById),
    productCategoriesController.removeProductCategories
  );
export default router;
