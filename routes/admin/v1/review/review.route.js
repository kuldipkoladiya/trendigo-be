import express from 'express';
import { reviewController } from 'controllers/admin';
import { reviewValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createReview
   * */
  .post(auth('admin'), validate(reviewValidation.createReview), reviewController.createReview)
  /**
   * getReview
   * */
  .get(auth('admin'), validate(reviewValidation.getReview), reviewController.listReview);
router
  .route('/paginated')
  /**
   * getReviewPaginated
   * */
  .get(auth('admin'), validate(reviewValidation.paginatedReview), reviewController.paginateReview);
router
  .route('/:reviewId')
  /**
   * getReviewById
   * */
  .get(auth('admin'), validate(reviewValidation.getReviewById), reviewController.getReview)
  /**
   * updateReview
   * */
  .put(auth('admin'), validate(reviewValidation.updateReview), reviewController.updateReview)
  /**
   * deleteReviewById
   * */
  .delete(auth('admin'), validate(reviewValidation.deleteReviewById), reviewController.removeReview);
export default router;
