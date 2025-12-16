import express from 'express';
import { productTypeController } from 'controllers/user';
import { productTypeValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductType
   * */
  .post(sellerAuth(), validate(productTypeValidation.createProductType), productTypeController.createProductType)
  /**
   * getProductType
   * */
  .get(sellerAuth(), validate(productTypeValidation.getProductType), productTypeController.listProductType);
router
  .route('/paginated')
  /**
   * getProductTypePaginated
   * */
  .get(sellerAuth(), validate(productTypeValidation.paginatedProductType), productTypeController.paginateProductType);
router
  .route('/:productTypeId')
  /**
   * getProductTypeById
   * */
  .get(sellerAuth(), validate(productTypeValidation.getProductTypeById), productTypeController.getProductType)
  /**
   * updateProductType
   * */
  .put(sellerAuth(), validate(productTypeValidation.updateProductType), productTypeController.updateProductType)
  /**
   * deleteProductTypeById
   * */
  .delete(sellerAuth(), validate(productTypeValidation.deleteProductTypeById), productTypeController.removeProductType);
export default router;
