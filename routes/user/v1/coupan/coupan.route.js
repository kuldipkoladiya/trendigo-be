import express from 'express';
import { coupanController } from 'controllers/user';
import { coupanValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createCoupan
   * */
  .post(auth('user'), validate(coupanValidation.createCoupan), coupanController.createCoupan)
  /**
   * getCoupan
   * */
  .get(auth('user'), validate(coupanValidation.getCoupan), coupanController.listCoupan);
router
  .route('/paginated')
  /**
   * getCoupanPaginated
   * */
  .get(auth('user'), validate(coupanValidation.paginatedCoupan), coupanController.paginateCoupan);
router
  .route('/:coupanId')
  /**
   * getCoupanById
   * */
  .get(auth('user'), validate(coupanValidation.getCoupanById), coupanController.getCoupan)
  /**
   * updateCoupan
   * */
  .put(auth('user'), validate(coupanValidation.updateCoupan), coupanController.updateCoupan)
  /**
   * deleteCoupanById
   * */
  .delete(auth('user'), validate(coupanValidation.deleteCoupanById), coupanController.removeCoupan);
export default router;
