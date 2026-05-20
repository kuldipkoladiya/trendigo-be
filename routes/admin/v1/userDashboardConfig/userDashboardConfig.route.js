import express from 'express';
import { userDashboardConfigController } from 'controllers/admin';
import { userDashboardConfigValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createUserDashboardConfig
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userDashboardConfigValidation.createUserDashboardConfig),
    userDashboardConfigController.createUserDashboardConfig
  )
  /**
   * getUserDashboardConfig
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userDashboardConfigValidation.getUserDashboardConfig),
    userDashboardConfigController.listUserDashboardConfig
  );
router
  .route('/paginated')
  /**
   * getUserDashboardConfigPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userDashboardConfigValidation.paginatedUserDashboardConfig),
    userDashboardConfigController.paginateUserDashboardConfig
  );
router
  .route('/:userDashboardConfigId')
  /**
   * getUserDashboardConfigById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userDashboardConfigValidation.getUserDashboardConfigById),
    userDashboardConfigController.getUserDashboardConfig
  )
  /**
   * updateUserDashboardConfig
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userDashboardConfigValidation.updateUserDashboardConfig),
    userDashboardConfigController.updateUserDashboardConfig
  )
  /**
   * deleteUserDashboardConfigById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userDashboardConfigValidation.deleteUserDashboardConfigById),
    userDashboardConfigController.removeUserDashboardConfig
  );
export default router;
