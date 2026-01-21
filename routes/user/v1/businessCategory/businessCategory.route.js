import express from 'express';
import { businessCategoryController } from 'controllers/user';
import { businessCategoryValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createBusinessCategory
   * */
  .post(
    sellerAuth(),
    validate(businessCategoryValidation.createBusinessCategory),
    businessCategoryController.createBusinessCategory
  )
  /**
   * getBusinessCategory
   * */
  .get(
    sellerAuth(),
    validate(businessCategoryValidation.getBusinessCategory),
    businessCategoryController.listBusinessCategory
  );
router
  .route('/paginated')
  /**
   * getBusinessCategoryPaginated
   * */
  .get(
    sellerAuth(),
    validate(businessCategoryValidation.paginatedBusinessCategory),
    businessCategoryController.paginateBusinessCategory
  );
router
  .route('/:businessCategoryId')
  /**
   * getBusinessCategoryById
   * */
  .get(
    sellerAuth(),
    validate(businessCategoryValidation.getBusinessCategoryById),
    businessCategoryController.getBusinessCategory
  )
  /**
   * updateBusinessCategory
   * */
  .put(
    sellerAuth(),
    validate(businessCategoryValidation.updateBusinessCategory),
    businessCategoryController.updateBusinessCategory
  )
  /**
   * deleteBusinessCategoryById
   * */
  .delete(
    sellerAuth(),
    validate(businessCategoryValidation.deleteBusinessCategoryById),
    businessCategoryController.removeBusinessCategory
  );
export default router;
