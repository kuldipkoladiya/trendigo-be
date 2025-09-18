import express from 'express';
import { productController } from 'controllers/admin';
import { productValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProduct
   * */
  .post(auth('admin'), validate(productValidation.createProduct), productController.createProduct)
  /**
   * getProduct
   * */
  .get(auth('admin'), validate(productValidation.getProduct), productController.listProduct);
router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(auth('admin'), validate(productValidation.paginatedProduct), productController.paginateProduct);
router
  .route('/:productId')
  /**
   * getProductById
   * */
  .get(auth('admin'), validate(productValidation.getProductById), productController.getProduct)
  /**
   * updateProduct
   * */
  .put(auth('admin'), validate(productValidation.updateProduct), productController.updateProduct)
  /**
   * deleteProductById
   * */
  .delete(auth('admin'), validate(productValidation.deleteProductById), productController.removeProduct);
export default router;
