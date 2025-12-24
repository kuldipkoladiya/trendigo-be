import express from 'express';
import { productCategoriesController } from 'controllers/user';
import { productCategoriesValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductCategories
   * */
  .post(
    sellerAuth(),
    validate(productCategoriesValidation.createProductCategories),
    productCategoriesController.createProductCategories
  )
  /**
   * getProductCategories
   * */
  .get(
    sellerAuth(),
    validate(productCategoriesValidation.getProductCategories),
    productCategoriesController.listProductCategories
  );
router
  .route('/get-categories')
  .get(validate(productCategoriesValidation.getProductCategories), productCategoriesController.listProductCategories);
router
  .route('/paginated')
  /**
   * getProductCategoriesPaginated
   * */
  .get(
    sellerAuth(),
    validate(productCategoriesValidation.paginatedProductCategories),
    productCategoriesController.paginateProductCategories
  );
router
  .route('/:productCategoriesId')
  /**
   * getProductCategoriesById
   * */
  .get(
    sellerAuth(),
    validate(productCategoriesValidation.getProductCategoriesById),
    productCategoriesController.getProductCategories
  )
  /**
   * updateProductCategories
   * */
  .put(
    sellerAuth(),
    validate(productCategoriesValidation.updateProductCategories),
    productCategoriesController.updateProductCategories
  )
  /**
   * deleteProductCategoriesById
   * */
  .delete(
    sellerAuth(),
    validate(productCategoriesValidation.deleteProductCategoriesById),
    productCategoriesController.removeProductCategories
  );
router
  .route('/get-list/:parentCategoryId')
  /**
   * getListProductCategoriesById
   * */
  .get(
    sellerAuth(),
    validate(productCategoriesValidation.getProductparentCategoryId),
    productCategoriesController.getProductCategoriesList
  );
/**
 * getProductCategories
 * */

export default router;
