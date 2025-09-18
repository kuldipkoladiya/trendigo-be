import express from 'express';
import { productTypeController } from 'controllers/user';
import { productTypeValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createProductType
   * */
  .post(auth('user'), validate(productTypeValidation.createProductType), productTypeController.createProductType)
  /**
   * getProductType
   * */
  .get(auth('user'), validate(productTypeValidation.getProductType), productTypeController.listProductType);
router
  .route('/paginated')
  /**
   * getProductTypePaginated
   * */
  .get(auth('user'), validate(productTypeValidation.paginatedProductType), productTypeController.paginateProductType);
router
  .route('/:productTypeId')
  /**
   * getProductTypeById
   * */
  .get(auth('user'), validate(productTypeValidation.getProductTypeById), productTypeController.getProductType)
  /**
   * updateProductType
   * */
  .put(auth('user'), validate(productTypeValidation.updateProductType), productTypeController.updateProductType)
  /**
   * deleteProductTypeById
   * */
  .delete(auth('user'), validate(productTypeValidation.deleteProductTypeById), productTypeController.removeProductType);
export default router;
