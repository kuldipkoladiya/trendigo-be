import express from 'express';
import { productBrandController } from 'controllers/user';
import { productBrandValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductBrand
   * */
  .post(auth('user'), validate(productBrandValidation.createProductBrand), productBrandController.createProductBrand)
  /**
   * getProductBrand
   * */
  .get(auth('user'), validate(productBrandValidation.getProductBrand), productBrandController.listProductBrand);
router
  .route('/paginated')
  /**
   * getProductBrandPaginated
   * */
  .get(auth('user'), validate(productBrandValidation.paginatedProductBrand), productBrandController.paginateProductBrand);
router
  .route('/:productBrandId')
  /**
   * getProductBrandById
   * */
  .get(auth('user'), validate(productBrandValidation.getProductBrandById), productBrandController.getProductBrand)
  /**
   * updateProductBrand
   * */
  .put(auth('user'), validate(productBrandValidation.updateProductBrand), productBrandController.updateProductBrand)
  /**
   * deleteProductBrandById
   * */
  .delete(auth('user'), validate(productBrandValidation.deleteProductBrandById), productBrandController.removeProductBrand);
export default router;
