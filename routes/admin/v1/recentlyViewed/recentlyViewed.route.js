import express from 'express';
import { recentlyViewedController } from 'controllers/admin';
import { recentlyViewedValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createRecentlyViewed
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(recentlyViewedValidation.createRecentlyViewed),
    recentlyViewedController.createRecentlyViewed
  )
  /**
   * getRecentlyViewed
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(recentlyViewedValidation.getRecentlyViewed),
    recentlyViewedController.listRecentlyViewed
  );
router
  .route('/paginated')
  /**
   * getRecentlyViewedPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(recentlyViewedValidation.paginatedRecentlyViewed),
    recentlyViewedController.paginateRecentlyViewed
  );
router
  .route('/:recentlyViewedId')
  /**
   * getRecentlyViewedById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(recentlyViewedValidation.getRecentlyViewedById),
    recentlyViewedController.getRecentlyViewed
  )
  /**
   * updateRecentlyViewed
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(recentlyViewedValidation.updateRecentlyViewed),
    recentlyViewedController.updateRecentlyViewed
  )
  /**
   * deleteRecentlyViewedById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(recentlyViewedValidation.deleteRecentlyViewedById),
    recentlyViewedController.removeRecentlyViewed
  );
export default router;
