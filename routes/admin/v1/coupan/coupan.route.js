import express from 'express';
import { coupanController } from 'controllers/admin';
import { coupanValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createCoupan
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(coupanValidation.createCoupan),
    coupanController.createCoupan
  )
  /**
   * getCoupan
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(coupanValidation.getCoupan),
    coupanController.listCoupan
  );
router
  .route('/paginated')
  /**
   * getCoupanPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(coupanValidation.paginatedCoupan),
    coupanController.paginateCoupan
  );
router
  .route('/:coupanId')
  /**
   * getCoupanById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(coupanValidation.getCoupanById),
    coupanController.getCoupan
  )
  /**
   * updateCoupan
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(coupanValidation.updateCoupan),
    coupanController.updateCoupan
  )
  /**
   * deleteCoupanById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(coupanValidation.deleteCoupanById),
    coupanController.removeCoupan
  );
export default router;
