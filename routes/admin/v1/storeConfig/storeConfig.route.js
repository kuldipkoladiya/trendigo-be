import express from 'express';
import { storeConfigController } from 'controllers/admin';
import { storeConfigValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createStoreConfig
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeConfigValidation.createStoreConfig),
    storeConfigController.createStoreConfig
  )
  /**
   * getStoreConfig
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeConfigValidation.getStoreConfig),
    storeConfigController.listStoreConfig
  );
router
  .route('/paginated')
  /**
   * getStoreConfigPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeConfigValidation.paginatedStoreConfig),
    storeConfigController.paginateStoreConfig
  );
router
  .route('/:storeConfigId')
  /**
   * getStoreConfigById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeConfigValidation.getStoreConfigById),
    storeConfigController.getStoreConfig
  )
  /**
   * updateStoreConfig
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeConfigValidation.updateStoreConfig),
    storeConfigController.updateStoreConfig
  )
  /**
   * deleteStoreConfigById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(storeConfigValidation.deleteStoreConfigById),
    storeConfigController.removeStoreConfig
  );
export default router;
