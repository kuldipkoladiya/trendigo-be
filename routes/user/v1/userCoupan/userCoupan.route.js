import express from 'express';
import { userCoupanController } from 'controllers/user';
import { userCoupanValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserCoupan
   * */
  .post(auth('user'), validate(userCoupanValidation.createUserCoupan), userCoupanController.createUserCoupan)
  /**
   * getUserCoupan
   * */
  .get(auth('user'), validate(userCoupanValidation.getUserCoupan), userCoupanController.listUserCoupan);
router
  .route('/paginated')
  /**
   * getUserCoupanPaginated
   * */
  .get(auth('user'), validate(userCoupanValidation.paginatedUserCoupan), userCoupanController.paginateUserCoupan);
router
  .route('/:userCoupanId')
  /**
   * getUserCoupanById
   * */
  .get(auth('user'), validate(userCoupanValidation.getUserCoupanById), userCoupanController.getUserCoupan)
  /**
   * updateUserCoupan
   * */
  .put(auth('user'), validate(userCoupanValidation.updateUserCoupan), userCoupanController.updateUserCoupan)
  /**
   * deleteUserCoupanById
   * */
  .delete(auth('user'), validate(userCoupanValidation.deleteUserCoupanById), userCoupanController.removeUserCoupan);
export default router;
