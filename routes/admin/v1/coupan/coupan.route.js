import express from 'express';
import { coupanController } from 'controllers/admin';
import { coupanValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createCoupan
   * */
  .post(auth('admin'), validate(coupanValidation.createCoupan), coupanController.createCoupan)
  /**
   * getCoupan
   * */
  .get(auth('admin'), validate(coupanValidation.getCoupan), coupanController.listCoupan);
router
  .route('/paginated')
  /**
   * getCoupanPaginated
   * */
  .get(auth('admin'), validate(coupanValidation.paginatedCoupan), coupanController.paginateCoupan);
router
  .route('/:coupanId')
  /**
   * getCoupanById
   * */
  .get(auth('admin'), validate(coupanValidation.getCoupanById), coupanController.getCoupan)
  /**
   * updateCoupan
   * */
  .put(auth('admin'), validate(coupanValidation.updateCoupan), coupanController.updateCoupan)
  /**
   * deleteCoupanById
   * */
  .delete(auth('admin'), validate(coupanValidation.deleteCoupanById), coupanController.removeCoupan);
export default router;
