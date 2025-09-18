import express from 'express';
import { productVarientsController } from 'controllers/user';
import { productVarientsValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarients
   * */
  .post(
    auth('user'),
    validate(productVarientsValidation.createProductVarients),
    productVarientsController.createProductVarients
  )
  /**
   * getProductVarients
   * */
  .get(auth('user'), validate(productVarientsValidation.getProductVarients), productVarientsController.listProductVarients);
router
  .route('/paginated')
  /**
   * getProductVarientsPaginated
   * */
  .get(
    auth('user'),
    validate(productVarientsValidation.paginatedProductVarients),
    productVarientsController.paginateProductVarients
  );
router
  .route('/:productVarientsId')
  /**
   * getProductVarientsById
   * */
  .get(
    auth('user'),
    validate(productVarientsValidation.getProductVarientsById),
    productVarientsController.getProductVarients
  )
  /**
   * updateProductVarients
   * */
  .put(
    auth('user'),
    validate(productVarientsValidation.updateProductVarients),
    productVarientsController.updateProductVarients
  )
  /**
   * deleteProductVarientsById
   * */
  .delete(
    auth('user'),
    validate(productVarientsValidation.deleteProductVarientsById),
    productVarientsController.removeProductVarients
  );
export default router;
