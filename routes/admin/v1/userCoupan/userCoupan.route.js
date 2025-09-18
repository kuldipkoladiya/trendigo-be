import express from 'express';
import { userCoupanController } from 'controllers/admin';
import { userCoupanValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserCoupan
   * */
  .post(auth('admin'), validate(userCoupanValidation.createUserCoupan), userCoupanController.createUserCoupan)
  /**
   * getUserCoupan
   * */
  .get(auth('admin'), validate(userCoupanValidation.getUserCoupan), userCoupanController.listUserCoupan);
router
  .route('/paginated')
  /**
   * getUserCoupanPaginated
   * */
  .get(auth('admin'), validate(userCoupanValidation.paginatedUserCoupan), userCoupanController.paginateUserCoupan);
router
  .route('/:userCoupanId')
  /**
   * getUserCoupanById
   * */
  .get(auth('admin'), validate(userCoupanValidation.getUserCoupanById), userCoupanController.getUserCoupan)
  /**
   * updateUserCoupan
   * */
  .put(auth('admin'), validate(userCoupanValidation.updateUserCoupan), userCoupanController.updateUserCoupan)
  /**
   * deleteUserCoupanById
   * */
  .delete(auth('admin'), validate(userCoupanValidation.deleteUserCoupanById), userCoupanController.removeUserCoupan);
export default router;
