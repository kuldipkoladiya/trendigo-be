import express from 'express';
import { userDashboardConfigController } from 'controllers/admin';
import { userDashboardConfigValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserDashboardConfig
   * */
  .post(
    auth('admin'),
    validate(userDashboardConfigValidation.createUserDashboardConfig),
    userDashboardConfigController.createUserDashboardConfig
  )
  /**
   * getUserDashboardConfig
   * */
  .get(
    auth('admin'),
    validate(userDashboardConfigValidation.getUserDashboardConfig),
    userDashboardConfigController.listUserDashboardConfig
  );
router
  .route('/paginated')
  /**
   * getUserDashboardConfigPaginated
   * */
  .get(
    auth('admin'),
    validate(userDashboardConfigValidation.paginatedUserDashboardConfig),
    userDashboardConfigController.paginateUserDashboardConfig
  );
router
  .route('/:userDashboardConfigId')
  /**
   * getUserDashboardConfigById
   * */
  .get(
    auth('admin'),
    validate(userDashboardConfigValidation.getUserDashboardConfigById),
    userDashboardConfigController.getUserDashboardConfig
  )
  /**
   * updateUserDashboardConfig
   * */
  .put(
    auth('admin'),
    validate(userDashboardConfigValidation.updateUserDashboardConfig),
    userDashboardConfigController.updateUserDashboardConfig
  )
  /**
   * deleteUserDashboardConfigById
   * */
  .delete(
    auth('admin'),
    validate(userDashboardConfigValidation.deleteUserDashboardConfigById),
    userDashboardConfigController.removeUserDashboardConfig
  );
export default router;
