import express from 'express';
import { reviewReplyThreadController } from 'controllers/user';
import { reviewReplyThreadValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();
router
  .route('/')
  /**
   * createReviewReplyThread
   * */
  .post(
    sellerAuth(),
    validate(reviewReplyThreadValidation.createReviewReplyThread),
    reviewReplyThreadController.createReviewReplyThread
  )
  /**
   * getReviewReplyThread
   * */
  .get(
    sellerAuth(),
    validate(reviewReplyThreadValidation.getReviewReplyThread),
    reviewReplyThreadController.listReviewReplyThread
  );
router
  .route('/paginated')
  /**
   * getReviewReplyThreadPaginated
   * */
  .get(
    sellerAuth(),
    validate(reviewReplyThreadValidation.paginatedReviewReplyThread),
    reviewReplyThreadController.paginateReviewReplyThread
  );
router
  .route('/:reviewReplyThreadId')
  /**
   * getReviewReplyThreadById
   * */
  .get(
    sellerAuth(),
    validate(reviewReplyThreadValidation.getReviewReplyThreadById),
    reviewReplyThreadController.getReviewReplyThread
  )
  /**
   * updateReviewReplyThread
   * */
  .put(
    sellerAuth(),
    validate(reviewReplyThreadValidation.updateReviewReplyThread),
    reviewReplyThreadController.updateReviewReplyThread
  )
  /**
   * deleteReviewReplyThreadById
   * */
  .delete(
    sellerAuth(),
    validate(reviewReplyThreadValidation.deleteReviewReplyThreadById),
    reviewReplyThreadController.removeReviewReplyThread
  );
export default router;
