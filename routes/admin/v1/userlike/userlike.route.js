import express from 'express';
import { userlikeController } from 'controllers/admin';
import { userlikeValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserlike
   * */
  .post(auth('admin'), validate(userlikeValidation.createUserlike), userlikeController.createUserlike)
  /**
   * getUserlike
   * */
  .get(auth('admin'), validate(userlikeValidation.getUserlike), userlikeController.listUserlike);
router
  .route('/paginated')
  /**
   * getUserlikePaginated
   * */
  .get(auth('admin'), validate(userlikeValidation.paginatedUserlike), userlikeController.paginateUserlike);
router
  .route('/:userlikeId')
  /**
   * getUserlikeById
   * */
  .get(auth('admin'), validate(userlikeValidation.getUserlikeById), userlikeController.getUserlike)
  /**
   * updateUserlike
   * */
  .put(auth('admin'), validate(userlikeValidation.updateUserlike), userlikeController.updateUserlike)
  /**
   * deleteUserlikeById
   * */
  .delete(auth('admin'), validate(userlikeValidation.deleteUserlikeById), userlikeController.removeUserlike);
export default router;
