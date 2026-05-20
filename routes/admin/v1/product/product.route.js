import express from 'express';
import { productController } from 'controllers/admin';
import { productValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createProduct
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productValidation.createProduct),
    productController.createProduct
  )
  /**
   * getProduct
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productValidation.getProduct),
    productController.listProduct
  );
router
  .route('/paginated')
  /**
   * getProductPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productValidation.paginatedProduct),
    productController.paginateProduct
  );
router
  .route('/:productId')
  /**
   * getProductById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productValidation.getProductById),
    productController.getProduct
  )
  /**
   * updateProduct
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productValidation.updateProduct),
    productController.updateProduct
  )
  /**
   * deleteProductById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(productValidation.deleteProductById),
    productController.removeProduct
  );
export default router;
