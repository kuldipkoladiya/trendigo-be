import express from 'express';
import { productController } from 'controllers/user';
import { productValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import sellerPermission from 'middlewares/sellerPermission';
import sellerAuth from '../../../../middlewares/sellerAuth';
import optionalAuth from '../../../../middlewares/optionalAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createProduct
   * */
  .post(
    sellerAuth(),
    sellerPermission('products', 'add'),
    validate(productValidation.createProduct),
    productController.createProduct
  )
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

router.get('/search', optionalAuth, validate(productValidation.searchProducts), productController.searchProducts);

router.get('/search-suggestions', productController.searchSuggestions);

router.get('/recent-searches', auth(), productController.getRecentSearches);
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
  .get(
    sellerAuth(),
    sellerPermission('products', 'view'),
    validate(productValidation.getSellerProduct),
    productController.getSellerProduct
  );
router
  .route('/by-store/:storeId')
  /**
   * getProductPaginateByStoreId
   * */
  .get(optionalAuth, validate(productValidation.getStoreProduct), productController.getStoreProduct);
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
  .put(
    sellerAuth(),
    sellerPermission('products', 'update'),
    validate(productValidation.updateProduct),
    productController.updateProduct
  )
  /**
   * deleteProductById
   * */
  .delete(sellerAuth(), validate(productValidation.deleteProductById), productController.removeProduct);
export default router;
