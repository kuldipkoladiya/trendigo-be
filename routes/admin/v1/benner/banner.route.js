import express from 'express';
import { bannerController } from 'controllers/admin';
import auth from '../../../../middlewares/auth';
import { EnumRoleOfUser } from '../../../../models/enum.model';

const router = express.Router();

router.post(
  '/',
  auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
  bannerController.createBanner
);
router.get('/', bannerController.getBannerList);
router.put(
  '/:bannerId',
  auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
  bannerController.updateBanner
);
router.delete(
  '/:bannerId',
  auth([EnumRoleOfUser.ADMIN, EnumRoleOfUser.SUPER_ADMIN, EnumRoleOfUser.CO_ADMIN]),
  bannerController.deleteBanner
);

export default router;
