import express from 'express';
import { reviewReplyThreadController } from 'controllers/admin';
import { reviewReplyThreadValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createReviewReplyThread
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewReplyThreadValidation.createReviewReplyThread),
    reviewReplyThreadController.createReviewReplyThread
  )
  /**
   * getReviewReplyThread
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewReplyThreadValidation.getReviewReplyThread),
    reviewReplyThreadController.listReviewReplyThread
  );
router
  .route('/paginated')
  /**
   * getReviewReplyThreadPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewReplyThreadValidation.paginatedReviewReplyThread),
    reviewReplyThreadController.paginateReviewReplyThread
  );
router
  .route('/:reviewReplyThreadId')
  /**
   * getReviewReplyThreadById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewReplyThreadValidation.getReviewReplyThreadById),
    reviewReplyThreadController.getReviewReplyThread
  )
  /**
   * updateReviewReplyThread
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewReplyThreadValidation.updateReviewReplyThread),
    reviewReplyThreadController.updateReviewReplyThread
  )
  /**
   * deleteReviewReplyThreadById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(reviewReplyThreadValidation.deleteReviewReplyThreadById),
    reviewReplyThreadController.removeReviewReplyThread
  );
export default router;
