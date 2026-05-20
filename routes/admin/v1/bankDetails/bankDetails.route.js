import express from 'express';
import { bankDetailsController } from 'controllers/admin';
import { bankDetailsValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createBankDetails
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(bankDetailsValidation.createBankDetails),
    bankDetailsController.createBankDetails
  )
  /**
   * getBankDetails
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(bankDetailsValidation.getBankDetails),
    bankDetailsController.listBankDetails
  );
router
  .route('/paginated')
  /**
   * getBankDetailsPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(bankDetailsValidation.paginatedBankDetails),
    bankDetailsController.paginateBankDetails
  );
router
  .route('/:bankDetailsId')
  /**
   * getBankDetailsById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(bankDetailsValidation.getBankDetailsById),
    bankDetailsController.getBankDetails
  )
  /**
   * updateBankDetails
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(bankDetailsValidation.updateBankDetails),
    bankDetailsController.updateBankDetails
  )
  /**
   * deleteBankDetailsById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(bankDetailsValidation.deleteBankDetailsById),
    bankDetailsController.removeBankDetails
  );
export default router;
