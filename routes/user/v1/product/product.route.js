import express from 'express';
import { productController } from 'controllers/user';
import { productValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProduct
   * */
  .post(auth('user'), validate(productValidation.createProduct), productController.createProduct)
  /**
   * getProduct
   * */
  .get(auth('user'), validate(productValidation.getProduct), productController.listProduct);
router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(auth('user'), validate(productValidation.paginatedProduct), productController.paginateProduct);
router
  .route('/:productId')
  /**
   * getProductById
   * */
  .get(auth('user'), validate(productValidation.getProductById), productController.getProduct)
  /**
   * updateProduct
   * */
  .put(auth('user'), validate(productValidation.updateProduct), productController.updateProduct)
  /**
   * deleteProductById
   * */
  .delete(auth('user'), validate(productValidation.deleteProductById), productController.removeProduct);
export default router;
