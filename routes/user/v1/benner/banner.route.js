import express from 'express';
import auth from 'middlewares/auth';
import { bannerController } from 'controllers/user';

const router = express.Router();

router.post('/', auth(), bannerController.createBanner);
router.get('/', bannerController.getBannerList);
router.put('/:bannerId', auth(), bannerController.updateBanner);
router.delete('/:bannerId', auth(), bannerController.deleteBanner);

export default router;
