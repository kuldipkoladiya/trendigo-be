import express from 'express';
import { bankDetailsController } from 'controllers/admin';
import { bankDetailsValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createBankDetails
   * */
  .post(auth('admin'), validate(bankDetailsValidation.createBankDetails), bankDetailsController.createBankDetails)
  /**
   * getBankDetails
   * */
  .get(auth('admin'), validate(bankDetailsValidation.getBankDetails), bankDetailsController.listBankDetails);
router
  .route('/paginated')
  /**
   * getBankDetailsPaginated
   * */
  .get(auth('admin'), validate(bankDetailsValidation.paginatedBankDetails), bankDetailsController.paginateBankDetails);
router
  .route('/:bankDetailsId')
  /**
   * getBankDetailsById
   * */
  .get(auth('admin'), validate(bankDetailsValidation.getBankDetailsById), bankDetailsController.getBankDetails)
  /**
   * updateBankDetails
   * */
  .put(auth('admin'), validate(bankDetailsValidation.updateBankDetails), bankDetailsController.updateBankDetails)
  /**
   * deleteBankDetailsById
   * */
  .delete(auth('admin'), validate(bankDetailsValidation.deleteBankDetailsById), bankDetailsController.removeBankDetails);
export default router;
