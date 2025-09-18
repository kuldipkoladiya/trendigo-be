import express from 'express';
import { productTypeController } from 'controllers/admin';
import { productTypeValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductType
   * */
  .post(auth('admin'), validate(productTypeValidation.createProductType), productTypeController.createProductType)
  /**
   * getProductType
   * */
  .get(auth('admin'), validate(productTypeValidation.getProductType), productTypeController.listProductType);
router
  .route('/paginated')
  /**
   * getProductTypePaginated
   * */
  .get(auth('admin'), validate(productTypeValidation.paginatedProductType), productTypeController.paginateProductType);
router
  .route('/:productTypeId')
  /**
   * getProductTypeById
   * */
  .get(auth('admin'), validate(productTypeValidation.getProductTypeById), productTypeController.getProductType)
  /**
   * updateProductType
   * */
  .put(auth('admin'), validate(productTypeValidation.updateProductType), productTypeController.updateProductType)
  /**
   * deleteProductTypeById
   * */
  .delete(auth('admin'), validate(productTypeValidation.deleteProductTypeById), productTypeController.removeProductType);
export default router;
