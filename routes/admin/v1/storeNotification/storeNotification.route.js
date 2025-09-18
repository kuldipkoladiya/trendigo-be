import express from 'express';
import { storeNotificationController } from 'controllers/admin';
import { storeNotificationValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreNotification
   * */
  .post(
    auth('admin'),
    validate(storeNotificationValidation.createStoreNotification),
    storeNotificationController.createStoreNotification
  )
  /**
   * getStoreNotification
   * */
  .get(
    auth('admin'),
    validate(storeNotificationValidation.getStoreNotification),
    storeNotificationController.listStoreNotification
  );
router
  .route('/paginated')
  /**
   * getStoreNotificationPaginated
   * */
  .get(
    auth('admin'),
    validate(storeNotificationValidation.paginatedStoreNotification),
    storeNotificationController.paginateStoreNotification
  );
router
  .route('/:storeNotificationId')
  /**
   * getStoreNotificationById
   * */
  .get(
    auth('admin'),
    validate(storeNotificationValidation.getStoreNotificationById),
    storeNotificationController.getStoreNotification
  )
  /**
   * updateStoreNotification
   * */
  .put(
    auth('admin'),
    validate(storeNotificationValidation.updateStoreNotification),
    storeNotificationController.updateStoreNotification
  )
  /**
   * deleteStoreNotificationById
   * */
  .delete(
    auth('admin'),
    validate(storeNotificationValidation.deleteStoreNotificationById),
    storeNotificationController.removeStoreNotification
  );
export default router;
