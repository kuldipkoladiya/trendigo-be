import express from 'express';
import { bannerController } from 'controllers/user';
import sellerAuth from '../../../../middlewares/sellerAuth';

const router = express.Router();

router.post('/', sellerAuth(), bannerController.createBanner);
router.get('/', sellerAuth(), bannerController.getBannerList);
router.put('/:bannerId', sellerAuth(), bannerController.updateBanner);
router.delete('/:bannerId', sellerAuth(), bannerController.deleteBanner);

export default router;
