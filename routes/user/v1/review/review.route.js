import express from 'express';
import { reviewController } from 'controllers/user';
import { reviewValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createReview
   * */
  .post(auth('user'), validate(reviewValidation.createReview), reviewController.createReview)
  /**
   * getReview
   * */
  .get(validate(reviewValidation.getReview), reviewController.listReview);
router
  .route('/paginated')
  /**
   * getReviewPaginated
   * */
  .get(auth('user'), validate(reviewValidation.paginatedReview), reviewController.paginateReview);
router
  .route('/by-product/:productId')
  /**
   * getReviewById
   * */
  .get(validate(reviewValidation.getReviewByproductId), reviewController.getReviewByproductId);
router
  .route('/by-seller/:sellerId')
  /**
   * getReviewById
   * */
  .get(validate(reviewValidation.getReviewBysellerId), reviewController.getReviewBysellerId);
router
  .route('/:reviewId')
  /**
   * getReviewById
   * */
  .get(auth('user'), validate(reviewValidation.getReviewById), reviewController.getReview)
  /**
   * updateReview
   * */
  .put(auth('user'), validate(reviewValidation.updateReview), reviewController.updateReview)
  /**
   * deleteReviewById
   * */
  .delete(auth('user'), validate(reviewValidation.deleteReviewById), reviewController.removeReview);
export default router;
