import express from 'express';
import { userlikeController } from 'controllers/user';
import { userlikeValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserlike
   * */
  .post(auth('user'), validate(userlikeValidation.createUserlike), userlikeController.createUserlike)
  /**
   * getUserlike
   * */
  .get(auth('user'), validate(userlikeValidation.getUserlike), userlikeController.listUserlike);
router
  .route('/paginated')
  /**
   * getUserlikePaginated
   * */
  .get(auth('user'), validate(userlikeValidation.paginatedUserlike), userlikeController.paginateUserlike);
router
  .route('/:userlikeId')
  /**
   * getUserlikeById
   * */
  .get(auth('user'), validate(userlikeValidation.getUserlikeById), userlikeController.getUserlike)
  /**
   * updateUserlike
   * */
  .put(auth('user'), validate(userlikeValidation.updateUserlike), userlikeController.updateUserlike)
  /**
   * deleteUserlikeById
   * */
  .delete(auth('user'), validate(userlikeValidation.deleteUserlikeById), userlikeController.removeUserlike);
export default router;
