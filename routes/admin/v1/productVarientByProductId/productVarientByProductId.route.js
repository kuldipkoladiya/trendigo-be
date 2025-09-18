import express from 'express';
import { productVarientByProductIdController } from 'controllers/admin';
import { productVarientByProductIdValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarientByProductId
   * */
  .post(
    auth('admin'),
    validate(productVarientByProductIdValidation.createProductVarientByProductId),
    productVarientByProductIdController.createProductVarientByProductId
  )
  /**
   * getProductVarientByProductId
   * */
  .get(
    auth('admin'),
    validate(productVarientByProductIdValidation.getProductVarientByProductId),
    productVarientByProductIdController.listProductVarientByProductId
  );
router
  .route('/paginated')
  /**
   * getProductVarientByProductIdPaginated
   * */
  .get(
    auth('admin'),
    validate(productVarientByProductIdValidation.paginatedProductVarientByProductId),
    productVarientByProductIdController.paginateProductVarientByProductId
  );
router
  .route('/:productVarientByProductIdId')
  /**
   * getProductVarientByProductIdById
   * */
  .get(
    auth('admin'),
    validate(productVarientByProductIdValidation.getProductVarientByProductIdById),
    productVarientByProductIdController.getProductVarientByProductId
  )
  /**
   * updateProductVarientByProductId
   * */
  .put(
    auth('admin'),
    validate(productVarientByProductIdValidation.updateProductVarientByProductId),
    productVarientByProductIdController.updateProductVarientByProductId
  )
  /**
   * deleteProductVarientByProductIdById
   * */
  .delete(
    auth('admin'),
    validate(productVarientByProductIdValidation.deleteProductVarientByProductIdById),
    productVarientByProductIdController.removeProductVarientByProductId
  );
export default router;
