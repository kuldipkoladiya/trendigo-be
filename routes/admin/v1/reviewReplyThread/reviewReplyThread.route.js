import express from 'express';
import { reviewReplyThreadController } from 'controllers/admin';
import { reviewReplyThreadValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createReviewReplyThread
   * */
  .post(
    auth('admin'),
    validate(reviewReplyThreadValidation.createReviewReplyThread),
    reviewReplyThreadController.createReviewReplyThread
  )
  /**
   * getReviewReplyThread
   * */
  .get(
    auth('admin'),
    validate(reviewReplyThreadValidation.getReviewReplyThread),
    reviewReplyThreadController.listReviewReplyThread
  );
router
  .route('/paginated')
  /**
   * getReviewReplyThreadPaginated
   * */
  .get(
    auth('admin'),
    validate(reviewReplyThreadValidation.paginatedReviewReplyThread),
    reviewReplyThreadController.paginateReviewReplyThread
  );
router
  .route('/:reviewReplyThreadId')
  /**
   * getReviewReplyThreadById
   * */
  .get(
    auth('admin'),
    validate(reviewReplyThreadValidation.getReviewReplyThreadById),
    reviewReplyThreadController.getReviewReplyThread
  )
  /**
   * updateReviewReplyThread
   * */
  .put(
    auth('admin'),
    validate(reviewReplyThreadValidation.updateReviewReplyThread),
    reviewReplyThreadController.updateReviewReplyThread
  )
  /**
   * deleteReviewReplyThreadById
   * */
  .delete(
    auth('admin'),
    validate(reviewReplyThreadValidation.deleteReviewReplyThreadById),
    reviewReplyThreadController.removeReviewReplyThread
  );
export default router;
