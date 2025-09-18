import express from 'express';
import { productVarientByProductIdController } from 'controllers/user';
import { productVarientByProductIdValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarientByProductId
   * */
  .post(
    auth('user'),
    validate(productVarientByProductIdValidation.createProductVarientByProductId),
    productVarientByProductIdController.createProductVarientByProductId
  )
  /**
   * getProductVarientByProductId
   * */
  .get(
    auth('user'),
    validate(productVarientByProductIdValidation.getProductVarientByProductId),
    productVarientByProductIdController.listProductVarientByProductId
  );
router
  .route('/paginated')
  /**
   * getProductVarientByProductIdPaginated
   * */
  .get(
    auth('user'),
    validate(productVarientByProductIdValidation.paginatedProductVarientByProductId),
    productVarientByProductIdController.paginateProductVarientByProductId
  );
router
  .route('/:productVarientByProductIdId')
  /**
   * getProductVarientByProductIdById
   * */
  .get(
    auth('user'),
    validate(productVarientByProductIdValidation.getProductVarientByProductIdById),
    productVarientByProductIdController.getProductVarientByProductId
  )
  /**
   * updateProductVarientByProductId
   * */
  .put(
    auth('user'),
    validate(productVarientByProductIdValidation.updateProductVarientByProductId),
    productVarientByProductIdController.updateProductVarientByProductId
  )
  /**
   * deleteProductVarientByProductIdById
   * */
  .delete(
    auth('user'),
    validate(productVarientByProductIdValidation.deleteProductVarientByProductIdById),
    productVarientByProductIdController.removeProductVarientByProductId
  );
export default router;
