import express from 'express';
import { testController } from 'controllers/admin';
import { testValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createTest
   * */
  .post(auth('admin'), validate(testValidation.createTest), testController.createTest)
  /**
   * getTest
   * */
  .get(auth('admin'), validate(testValidation.getTest), testController.listTest);
router
  .route('/paginated')
  /**
   * getTestPaginated
   * */
  .get(auth('admin'), validate(testValidation.paginatedTest), testController.paginateTest);
router
  .route('/:testId')
  /**
   * getTestById
   * */
  .get(auth('admin'), validate(testValidation.getTestById), testController.getTest)
  /**
   * updateTest
   * */
  .put(auth('admin'), validate(testValidation.updateTest), testController.updateTest)
  /**
   * deleteTestById
   * */
  .delete(auth('admin'), validate(testValidation.deleteTestById), testController.removeTest);
export default router;
