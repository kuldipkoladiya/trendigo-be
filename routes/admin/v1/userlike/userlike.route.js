import express from 'express';
import { userlikeController } from 'controllers/admin';
import { userlikeValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createUserlike
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userlikeValidation.createUserlike),
    userlikeController.createUserlike
  )
  /**
   * getUserlike
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userlikeValidation.getUserlike),
    userlikeController.listUserlike
  );
router
  .route('/paginated')
  /**
   * getUserlikePaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userlikeValidation.paginatedUserlike),
    userlikeController.paginateUserlike
  );
router
  .route('/:userlikeId')
  /**
   * getUserlikeById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userlikeValidation.getUserlikeById),
    userlikeController.getUserlike
  )
  /**
   * updateUserlike
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userlikeValidation.updateUserlike),
    userlikeController.updateUserlike
  )
  /**
   * deleteUserlikeById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(userlikeValidation.deleteUserlikeById),
    userlikeController.removeUserlike
  );
export default router;
