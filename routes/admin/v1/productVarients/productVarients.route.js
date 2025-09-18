import express from 'express';
import { productVarientsController } from 'controllers/admin';
import { productVarientsValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarients
   * */
  .post(
    auth('admin'),
    validate(productVarientsValidation.createProductVarients),
    productVarientsController.createProductVarients
  )
  /**
   * getProductVarients
   * */
  .get(auth('admin'), validate(productVarientsValidation.getProductVarients), productVarientsController.listProductVarients);
router
  .route('/paginated')
  /**
   * getProductVarientsPaginated
   * */
  .get(
    auth('admin'),
    validate(productVarientsValidation.paginatedProductVarients),
    productVarientsController.paginateProductVarients
  );
router
  .route('/:productVarientsId')
  /**
   * getProductVarientsById
   * */
  .get(
    auth('admin'),
    validate(productVarientsValidation.getProductVarientsById),
    productVarientsController.getProductVarients
  )
  /**
   * updateProductVarients
   * */
  .put(
    auth('admin'),
    validate(productVarientsValidation.updateProductVarients),
    productVarientsController.updateProductVarients
  )
  /**
   * deleteProductVarientsById
   * */
  .delete(
    auth('admin'),
    validate(productVarientsValidation.deleteProductVarientsById),
    productVarientsController.removeProductVarients
  );
export default router;
