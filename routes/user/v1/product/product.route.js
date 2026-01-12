import express from 'express';
import { productController } from 'controllers/user';
import { productValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createProduct
   * */
  .post(sellerAuth(), validate(productValidation.createProduct), productController.createProduct)
  /**
   * getProduct
   * */
  .get(validate(productValidation.getProduct), productController.listProduct);
router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(auth('user'), validate(productValidation.paginatedProduct), productController.paginateProduct);
router
  .route('/by-seller/:sellerId')
  /**
   * getProductPaginated
   * */
  .get(sellerAuth(), validate(productValidation.getSellerProduct), productController.getSellerProduct);
router
  .route('/:productId')
  /**
   * getProductById
   * */
  .get(validate(productValidation.getProductById), productController.getProduct)
  /**
   * updateProduct
   * */
  .put(sellerAuth(), validate(productValidation.updateProduct), productController.updateProduct)
  /**
   * deleteProductById
   * */
  .delete(auth('user'), validate(productValidation.deleteProductById), productController.removeProduct);
export default router;
