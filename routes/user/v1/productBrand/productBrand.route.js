import express from 'express';
import { productBrandController } from 'controllers/user';
import { productBrandValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductBrand
   * */
  .post(sellerAuth(), validate(productBrandValidation.createProductBrand), productBrandController.createProductBrand)
  /**
   * getProductBrand
   * */
  .get(sellerAuth(), validate(productBrandValidation.getProductBrand), productBrandController.listProductBrand);
router
  .route('/paginated')
  /**
   * getProductBrandPaginated
   * */
  .get(sellerAuth(), validate(productBrandValidation.paginatedProductBrand), productBrandController.paginateProductBrand);
router
  .route('/:productBrandId')
  /**
   * getProductBrandById
   * */
  .get(sellerAuth(), validate(productBrandValidation.getProductBrandById), productBrandController.getProductBrand)
  /**
   * updateProductBrand
   * */
  .put(sellerAuth(), validate(productBrandValidation.updateProductBrand), productBrandController.updateProductBrand)
  /**
   * deleteProductBrandById
   * */
  .delete(sellerAuth(), validate(productBrandValidation.deleteProductBrandById), productBrandController.removeProductBrand);
export default router;
