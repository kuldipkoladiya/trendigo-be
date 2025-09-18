import express from 'express';
import { productBrandController } from 'controllers/admin';
import { productBrandValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductBrand
   * */
  .post(auth('admin'), validate(productBrandValidation.createProductBrand), productBrandController.createProductBrand)
  /**
   * getProductBrand
   * */
  .get(auth('admin'), validate(productBrandValidation.getProductBrand), productBrandController.listProductBrand);
router
  .route('/paginated')
  /**
   * getProductBrandPaginated
   * */
  .get(auth('admin'), validate(productBrandValidation.paginatedProductBrand), productBrandController.paginateProductBrand);
router
  .route('/:productBrandId')
  /**
   * getProductBrandById
   * */
  .get(auth('admin'), validate(productBrandValidation.getProductBrandById), productBrandController.getProductBrand)
  /**
   * updateProductBrand
   * */
  .put(auth('admin'), validate(productBrandValidation.updateProductBrand), productBrandController.updateProductBrand)
  /**
   * deleteProductBrandById
   * */
  .delete(auth('admin'), validate(productBrandValidation.deleteProductBrandById), productBrandController.removeProductBrand);
export default router;
