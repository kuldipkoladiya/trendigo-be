import express from 'express';
import { recentlyViewedController } from 'controllers/user';
import { recentlyViewedValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createRecentlyViewed
   * */
  .post(auth('user'), validate(recentlyViewedValidation.createRecentlyViewed), recentlyViewedController.createRecentlyViewed)
  /**
   * getRecentlyViewed
   * */
  .get(auth('user'), validate(recentlyViewedValidation.getRecentlyViewed), recentlyViewedController.listRecentlyViewed);
router
  .route('/paginated')
  /**
   * getRecentlyViewedPaginated
   * */
  .get(
    auth('user'),
    validate(recentlyViewedValidation.paginatedRecentlyViewed),
    recentlyViewedController.paginateRecentlyViewed
  );
router
  .route('/:recentlyViewedId')
  /**
   * getRecentlyViewedById
   * */
  .get(auth('user'), validate(recentlyViewedValidation.getRecentlyViewedById), recentlyViewedController.getRecentlyViewed)
  /**
   * updateRecentlyViewed
   * */
  .put(auth('user'), validate(recentlyViewedValidation.updateRecentlyViewed), recentlyViewedController.updateRecentlyViewed)
  /**
   * deleteRecentlyViewedById
   * */
  .delete(
    auth('user'),
    validate(recentlyViewedValidation.deleteRecentlyViewedById),
    recentlyViewedController.removeRecentlyViewed
  );
export default router;
