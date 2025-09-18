import express from 'express';
import { testController } from 'controllers/user';
import { testValidation } from 'validations/user';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * createTest
   * */
  .post(auth('user'), validate(testValidation.createTest), testController.createTest)
  /**
   * getTest
   * */
  .get(auth('user'), validate(testValidation.getTest), testController.listTest);
router
  .route('/paginated')
  /**
   * getTestPaginated
   * */
  .get(auth('user'), validate(testValidation.paginatedTest), testController.paginateTest);
router
  .route('/:testId')
  /**
   * getTestById
   * */
  .get(auth('user'), validate(testValidation.getTestById), testController.getTest)
  /**
   * updateTest
   * */
  .put(auth('user'), validate(testValidation.updateTest), testController.updateTest)
  /**
   * deleteTestById
   * */
  .delete(auth('user'), validate(testValidation.deleteTestById), testController.removeTest);
export default router;
