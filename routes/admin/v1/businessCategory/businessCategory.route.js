import express from 'express';
import { businessCategoryController } from 'controllers/admin';
import { businessCategoryValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createBusinessCategory
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(businessCategoryValidation.createBusinessCategory),
    businessCategoryController.createBusinessCategory
  )
  /**
   * getBusinessCategory
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(businessCategoryValidation.getBusinessCategory),
    businessCategoryController.listBusinessCategory
  );
router
  .route('/paginated')
  /**
   * getBusinessCategoryPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(businessCategoryValidation.paginatedBusinessCategory),
    businessCategoryController.paginateBusinessCategory
  );
router
  .route('/:businessCategoryId')
  /**
   * getBusinessCategoryById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(businessCategoryValidation.getBusinessCategoryById),
    businessCategoryController.getBusinessCategory
  )
  /**
   * updateBusinessCategory
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(businessCategoryValidation.updateBusinessCategory),
    businessCategoryController.updateBusinessCategory
  )
  /**
   * deleteBusinessCategoryById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(businessCategoryValidation.deleteBusinessCategoryById),
    businessCategoryController.removeBusinessCategory
  );
export default router;
