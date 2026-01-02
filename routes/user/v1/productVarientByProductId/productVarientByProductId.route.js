import express from 'express';
import { productVarientByProductIdController } from 'controllers/user';
import { productVarientByProductIdValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from 'middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductVarientByProductId
   * */
  .post(
    sellerAuth(),
    validate(productVarientByProductIdValidation.createProductVarientByProductId),
    productVarientByProductIdController.createProductVarientByProductId
  )
  /**
   * getProductVarientByProductId
   * */
  .get(
    sellerAuth(),
    validate(productVarientByProductIdValidation.getProductVarientByProductId),
    productVarientByProductIdController.listProductVarientByProductId
  );
router
  .route('/paginated')
  /**
   * getProductVarientByProductIdPaginated
   * */
  .get(
    sellerAuth(),
    validate(productVarientByProductIdValidation.paginatedProductVarientByProductId),
    productVarientByProductIdController.paginateProductVarientByProductId
  );
router
  .route('/:productVarientByProductIdId')
  /**
   * getProductVarientByProductIdById
   * */
  .get(
    sellerAuth(),
    validate(productVarientByProductIdValidation.getProductVarientByProductIdById),
    productVarientByProductIdController.getProductVarientByProductId
  )
  /**
   * updateProductVarientByProductId
   * */
  .put(
    sellerAuth(),
    validate(productVarientByProductIdValidation.updateProductVarientByProductId),
    productVarientByProductIdController.updateProductVarientByProductId
  )
  /**
   * deleteProductVarientByProductIdById
   * */
  .delete(
    sellerAuth(),
    validate(productVarientByProductIdValidation.deleteProductVarientByProductIdById),
    productVarientByProductIdController.removeProductVarientByProductId
  );
router
  .route('/get-color/:productId')
  /**
   * getProductVarientByProductIdById
   * */
  .get(
    sellerAuth(),
    validate(productVarientByProductIdValidation.getVarientByProductId),
    productVarientByProductIdController.getVarientColor
  );
router
  .route('/by-productid/:productId')
  /**
   * getProductVarientByProductIdById
   * */
  .get(
    sellerAuth(),
    validate(productVarientByProductIdValidation.getVarientByProductId),
    productVarientByProductIdController.getVarientByProductId
  );
export default router;
