import express from 'express';
import { userDashboardConfigController } from 'controllers/user';
import { userDashboardConfigValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createUserDashboardConfig
   * */
  .post(
    auth('user'),
    validate(userDashboardConfigValidation.createUserDashboardConfig),
    userDashboardConfigController.createUserDashboardConfig
  )
  /**
   * getUserDashboardConfig
   * */
  .get(
    auth('user'),
    validate(userDashboardConfigValidation.getUserDashboardConfig),
    userDashboardConfigController.listUserDashboardConfig
  );
router
  .route('/paginated')
  /**
   * getUserDashboardConfigPaginated
   * */
  .get(
    auth('user'),
    validate(userDashboardConfigValidation.paginatedUserDashboardConfig),
    userDashboardConfigController.paginateUserDashboardConfig
  );
router
  .route('/:userDashboardConfigId')
  /**
   * getUserDashboardConfigById
   * */
  .get(
    auth('user'),
    validate(userDashboardConfigValidation.getUserDashboardConfigById),
    userDashboardConfigController.getUserDashboardConfig
  )
  /**
   * updateUserDashboardConfig
   * */
  .put(
    auth('user'),
    validate(userDashboardConfigValidation.updateUserDashboardConfig),
    userDashboardConfigController.updateUserDashboardConfig
  )
  /**
   * deleteUserDashboardConfigById
   * */
  .delete(
    auth('user'),
    validate(userDashboardConfigValidation.deleteUserDashboardConfigById),
    userDashboardConfigController.removeUserDashboardConfig
  );
export default router;
