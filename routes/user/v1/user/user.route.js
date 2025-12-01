import express from 'express';
import { userController } from 'controllers/user';
import { userValidation } from 'validations/user';
import validate from 'middlewares/validate';
import { auth } from 'firebase-admin';

const router = express.Router();
router
  .route('/')
  /**
   * createUser
   * */
  .post(validate(userValidation.createUser), userController.createUser)
  /**
   * getUser
   * */
  .get(auth(), validate(userValidation.getUser), userController.listUser)
  /**
   * deleteUserById
   * */
  .delete(auth(), validate(userValidation.deleteUserById), userController.removeUser);
router
  .route('/paginated')
  /**
   * getUserPaginated
   * */
  .get(validate(userValidation.paginatedUser), userController.paginateUser);
router
  .route('/:userId')
  /**
   * getUserById
   * */
  .get(validate(userValidation.getUserById), userController.getUser)
  /**
   * updateUser
   * */
  .put(validate(userValidation.updateUser), userController.updateUser);

export default router;
