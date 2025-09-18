import express from 'express';
import { storeNotificationController } from 'controllers/user';
import { storeNotificationValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreNotification
   * */
  .post(
    auth('user'),
    validate(storeNotificationValidation.createStoreNotification),
    storeNotificationController.createStoreNotification
  )
  /**
   * getStoreNotification
   * */
  .get(
    auth('user'),
    validate(storeNotificationValidation.getStoreNotification),
    storeNotificationController.listStoreNotification
  );
router
  .route('/paginated')
  /**
   * getStoreNotificationPaginated
   * */
  .get(
    auth('user'),
    validate(storeNotificationValidation.paginatedStoreNotification),
    storeNotificationController.paginateStoreNotification
  );
router
  .route('/:storeNotificationId')
  /**
   * getStoreNotificationById
   * */
  .get(
    auth('user'),
    validate(storeNotificationValidation.getStoreNotificationById),
    storeNotificationController.getStoreNotification
  )
  /**
   * updateStoreNotification
   * */
  .put(
    auth('user'),
    validate(storeNotificationValidation.updateStoreNotification),
    storeNotificationController.updateStoreNotification
  )
  /**
   * deleteStoreNotificationById
   * */
  .delete(
    auth('user'),
    validate(storeNotificationValidation.deleteStoreNotificationById),
    storeNotificationController.removeStoreNotification
  );
export default router;
