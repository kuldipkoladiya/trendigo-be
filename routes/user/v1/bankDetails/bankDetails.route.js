import express from 'express';
import { bankDetailsController } from 'controllers/user';
import { bankDetailsValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createBankDetails
   * */
  .post(auth('user'), validate(bankDetailsValidation.createBankDetails), bankDetailsController.createBankDetails)
  /**
   * getBankDetails
   * */
  .get(auth('user'), validate(bankDetailsValidation.getBankDetails), bankDetailsController.listBankDetails);
router
  .route('/paginated')
  /**
   * getBankDetailsPaginated
   * */
  .get(auth('user'), validate(bankDetailsValidation.paginatedBankDetails), bankDetailsController.paginateBankDetails);
router
  .route('/:bankDetailsId')
  /**
   * getBankDetailsById
   * */
  .get(auth('user'), validate(bankDetailsValidation.getBankDetailsById), bankDetailsController.getBankDetails)
  /**
   * updateBankDetails
   * */
  .put(auth('user'), validate(bankDetailsValidation.updateBankDetails), bankDetailsController.updateBankDetails)
  /**
   * deleteBankDetailsById
   * */
  .delete(auth('user'), validate(bankDetailsValidation.deleteBankDetailsById), bankDetailsController.removeBankDetails);
export default router;
