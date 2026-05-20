import express from 'express';
import { sellerUserController } from 'controllers/admin';
import { sellerUserValidation } from 'validations/admin';
import validate from 'middlewares/validate';
import auth from 'middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();
router
  .route('/')
  /**
   * createSellerUser
   * */
  .post(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerUserValidation.createSellerUser),
    sellerUserController.createSellerUser
  )
  /**
   * getSellerUser
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerUserValidation.getSellerUser),
    sellerUserController.listSellerUser
  );
router
  .route('/paginated')
  /**
   * getSellerUserPaginated
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerUserValidation.paginatedSellerUser),
    sellerUserController.paginateSellerUser
  );
router
  .route('/:sellerUserId')
  /**
   * getSellerUserById
   * */
  .get(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerUserValidation.getSellerUserById),
    sellerUserController.getSellerUser
  )
  /**
   * updateSellerUser
   * */
  .put(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerUserValidation.updateSellerUser),
    sellerUserController.updateSellerUser
  )
  /**
   * deleteSellerUserById
   * */
  .delete(
    auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
    validate(sellerUserValidation.deleteSellerUserById),
    sellerUserController.removeSellerUser
  );
export default router;
