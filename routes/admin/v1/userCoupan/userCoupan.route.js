import express from 'express';
import { userCoupanController } from 'controllers/admin';
import { userCoupanValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createUserCoupan
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userCoupanValidation.createUserCoupan),
    userCoupanController.createUserCoupan
  )
  /**
   * getUserCoupan
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userCoupanValidation.getUserCoupan),
    userCoupanController.listUserCoupan
  );
router
  .route('/paginated')
  /**
   * getUserCoupanPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userCoupanValidation.paginatedUserCoupan),
    userCoupanController.paginateUserCoupan
  );
router
  .route('/:userCoupanId')
  /**
   * getUserCoupanById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userCoupanValidation.getUserCoupanById),
    userCoupanController.getUserCoupan
  )
  /**
   * updateUserCoupan
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userCoupanValidation.updateUserCoupan),
    userCoupanController.updateUserCoupan
  )
  /**
   * deleteUserCoupanById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userCoupanValidation.deleteUserCoupanById),
    userCoupanController.removeUserCoupan
  );
export default router;
