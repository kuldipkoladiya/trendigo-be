import express from 'express';
import { recentlyViewedController } from 'controllers/admin';
import { recentlyViewedValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createRecentlyViewed
   * */
  .post(
    auth('admin'),
    validate(recentlyViewedValidation.createRecentlyViewed),
    recentlyViewedController.createRecentlyViewed
  )
  /**
   * getRecentlyViewed
   * */
  .get(auth('admin'), validate(recentlyViewedValidation.getRecentlyViewed), recentlyViewedController.listRecentlyViewed);
router
  .route('/paginated')
  /**
   * getRecentlyViewedPaginated
   * */
  .get(
    auth('admin'),
    validate(recentlyViewedValidation.paginatedRecentlyViewed),
    recentlyViewedController.paginateRecentlyViewed
  );
router
  .route('/:recentlyViewedId')
  /**
   * getRecentlyViewedById
   * */
  .get(auth('admin'), validate(recentlyViewedValidation.getRecentlyViewedById), recentlyViewedController.getRecentlyViewed)
  /**
   * updateRecentlyViewed
   * */
  .put(auth('admin'), validate(recentlyViewedValidation.updateRecentlyViewed), recentlyViewedController.updateRecentlyViewed)
  /**
   * deleteRecentlyViewedById
   * */
  .delete(
    auth('admin'),
    validate(recentlyViewedValidation.deleteRecentlyViewedById),
    recentlyViewedController.removeRecentlyViewed
  );
export default router;
