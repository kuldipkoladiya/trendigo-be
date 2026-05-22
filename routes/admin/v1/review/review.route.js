import express from 'express';
import { reviewController } from 'controllers/admin';
import { reviewValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createReview
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.createReview),
    reviewController.createReview
  )
  /**
   * getReview
   * */
  .get(validate(reviewValidation.getReview), reviewController.listReview);
router
  .route('/paginated')
  /**
   * getReviewPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.paginatedReview),
    reviewController.paginateReview
  );
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
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.getReviewBysellerId),
    reviewController.getReviewBysellerId
  );
router
  .route('/by-user/:userId')
  /**
   * getReviewById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.getReviewByuserId),
    reviewController.getReviewByUserId
  );
router
  .route('/:reviewId')
  /**
   * getReviewById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.getReviewById),
    reviewController.getReview
  )
  /**
   * updateReview
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.updateReview),
    reviewController.updateReview
  )
  /**
   * deleteReviewById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewValidation.deleteReviewById),
    reviewController.removeReview
  );
export default router;
