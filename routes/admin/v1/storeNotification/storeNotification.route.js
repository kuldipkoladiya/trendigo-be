import express from 'express';
import { storeNotificationController } from 'controllers/admin';
import { storeNotificationValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreNotification
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeNotificationValidation.createStoreNotification),
    storeNotificationController.createStoreNotification
  )
  /**
   * getStoreNotification
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeNotificationValidation.getStoreNotification),
    storeNotificationController.listStoreNotification
  );
router
  .route('/paginated')
  /**
   * getStoreNotificationPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeNotificationValidation.paginatedStoreNotification),
    storeNotificationController.paginateStoreNotification
  );
router
  .route('/:storeNotificationId')
  /**
   * getStoreNotificationById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeNotificationValidation.getStoreNotificationById),
    storeNotificationController.getStoreNotification
  )
  /**
   * updateStoreNotification
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeNotificationValidation.updateStoreNotification),
    storeNotificationController.updateStoreNotification
  )
  /**
   * deleteStoreNotificationById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeNotificationValidation.deleteStoreNotificationById),
    storeNotificationController.removeStoreNotification
  );
export default router;
