import express from 'express';
import { storeController } from 'controllers/admin';
import { storeValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createStore
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeValidation.createStore),
    storeController.createStore
  )
  /**
   * getStore
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeValidation.getStore),
    storeController.listStore
  );
router
  .route('/paginated')
  /**
   * getStorePaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeValidation.paginatedStore),
    storeController.paginateStore
  );
router
  .route('/:storeId')
  /**
   * getStoreById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeValidation.getStoreById),
    storeController.getStore
  )
  /**
   * updateStore
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeValidation.updateStore),
    storeController.updateStore
  )
  /**
   * deleteStoreById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeValidation.deleteStoreById),
    storeController.removeStore
  );
export default router;
