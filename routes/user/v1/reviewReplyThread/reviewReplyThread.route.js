import express from 'express';
import { reviewReplyThreadController } from 'controllers/user';
import { reviewReplyThreadValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createReviewReplyThread
   * */
  .post(
    auth('user'),
    validate(reviewReplyThreadValidation.createReviewReplyThread),
    reviewReplyThreadController.createReviewReplyThread
  )
  /**
   * getReviewReplyThread
   * */
  .get(
    auth('user'),
    validate(reviewReplyThreadValidation.getReviewReplyThread),
    reviewReplyThreadController.listReviewReplyThread
  );
router
  .route('/paginated')
  /**
   * getReviewReplyThreadPaginated
   * */
  .get(
    auth('user'),
    validate(reviewReplyThreadValidation.paginatedReviewReplyThread),
    reviewReplyThreadController.paginateReviewReplyThread
  );
router
  .route('/:reviewReplyThreadId')
  /**
   * getReviewReplyThreadById
   * */
  .get(
    auth('user'),
    validate(reviewReplyThreadValidation.getReviewReplyThreadById),
    reviewReplyThreadController.getReviewReplyThread
  )
  /**
   * updateReviewReplyThread
   * */
  .put(
    auth('user'),
    validate(reviewReplyThreadValidation.updateReviewReplyThread),
    reviewReplyThreadController.updateReviewReplyThread
  )
  /**
   * deleteReviewReplyThreadById
   * */
  .delete(
    auth('user'),
    validate(reviewReplyThreadValidation.deleteReviewReplyThreadById),
    reviewReplyThreadController.removeReviewReplyThread
  );
export default router;
