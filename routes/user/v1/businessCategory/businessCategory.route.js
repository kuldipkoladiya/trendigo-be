import express from 'express';
import { businessCategoryController } from 'controllers/user';
import { businessCategoryValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createBusinessCategory
   * */
  .post(
    auth('user'),
    validate(businessCategoryValidation.createBusinessCategory),
    businessCategoryController.createBusinessCategory
  )
  /**
   * getBusinessCategory
   * */
  .get(
    auth('user'),
    validate(businessCategoryValidation.getBusinessCategory),
    businessCategoryController.listBusinessCategory
  );
router
  .route('/paginated')
  /**
   * getBusinessCategoryPaginated
   * */
  .get(
    auth('user'),
    validate(businessCategoryValidation.paginatedBusinessCategory),
    businessCategoryController.paginateBusinessCategory
  );
router
  .route('/:businessCategoryId')
  /**
   * getBusinessCategoryById
   * */
  .get(
    auth('user'),
    validate(businessCategoryValidation.getBusinessCategoryById),
    businessCategoryController.getBusinessCategory
  )
  /**
   * updateBusinessCategory
   * */
  .put(
    auth('user'),
    validate(businessCategoryValidation.updateBusinessCategory),
    businessCategoryController.updateBusinessCategory
  )
  /**
   * deleteBusinessCategoryById
   * */
  .delete(
    auth('user'),
    validate(businessCategoryValidation.deleteBusinessCategoryById),
    businessCategoryController.removeBusinessCategory
  );
export default router;
