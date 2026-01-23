import express from 'express';
import { productController } from 'controllers/user';
import { productValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import sellerAuth from '../../../../middlewares/sellerAuth';
import optionalAuth from '../../../../middlewares/optionalAuth';

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
  .route('/listProductByReview')
  /**
   * listProductByReview
   * */
  .get(optionalAuth, productController.listProductByReview);
router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(auth('user'), validate(productValidation.paginatedProduct), productController.paginateProduct);
router
  .route('/by-product-type/:productType')
  /**
   * getProductsByProductType
   * */
  .get(validate(productValidation.getProductsByProductType), productController.getProductsByProductType);
router
  .route('/by-product-category/:category')
  .get(validate(productValidation.getProductsByProductCategory), productController.getProductsByProductCategory);
router
  .route('/by-seller/:sellerId')
  /**
   * getProductPaginated
   * */
  .get(sellerAuth(), validate(productValidation.getSellerProduct), productController.getSellerProduct);
router.get(
  '/details/:productId',
  optionalAuth, // 👈 important
  validate(productValidation.getProductById),
  productController.getProductDetails
);
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
