import express from 'express';
import { sellerRoleController } from 'controllers/user';
import { sellerRoleValidation } from 'validations/user';
import validate from 'middlewares/validate';
import sellerAuth from 'middlewares/sellerAuth';

const router = express.Router();

router
  .route('/')
  .post(sellerAuth(), validate(sellerRoleValidation.addRole), sellerRoleController.add)
  .get(sellerAuth(), sellerRoleController.list);

router
  .route('/:roleId')
  .put(sellerAuth(), validate(sellerRoleValidation.updateRole), sellerRoleController.update)
  .delete(sellerAuth(), validate(sellerRoleValidation.deleteRole), sellerRoleController.Delete);

export default router;
