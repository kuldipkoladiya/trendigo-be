import express from 'express';
import { businessCategoryController } from 'controllers/admin';
import { businessCategoryValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createBusinessCategory
   * */
  .post(
    auth('admin'),
    validate(businessCategoryValidation.createBusinessCategory),
    businessCategoryController.createBusinessCategory
  )
  /**
   * getBusinessCategory
   * */
  .get(
    auth('admin'),
    validate(businessCategoryValidation.getBusinessCategory),
    businessCategoryController.listBusinessCategory
  );
router
  .route('/paginated')
  /**
   * getBusinessCategoryPaginated
   * */
  .get(
    auth('admin'),
    validate(businessCategoryValidation.paginatedBusinessCategory),
    businessCategoryController.paginateBusinessCategory
  );
router
  .route('/:businessCategoryId')
  /**
   * getBusinessCategoryById
   * */
  .get(
    auth('admin'),
    validate(businessCategoryValidation.getBusinessCategoryById),
    businessCategoryController.getBusinessCategory
  )
  /**
   * updateBusinessCategory
   * */
  .put(
    auth('admin'),
    validate(businessCategoryValidation.updateBusinessCategory),
    businessCategoryController.updateBusinessCategory
  )
  /**
   * deleteBusinessCategoryById
   * */
  .delete(
    auth('admin'),
    validate(businessCategoryValidation.deleteBusinessCategoryById),
    businessCategoryController.removeBusinessCategory
  );
export default router;
