import express from 'express';
import auth from 'middlewares/auth';
import validate from 'middlewares/validate';
import { s3Controller } from 'controllers/common';
import { s3Validation } from 'validations/common';
import sellerAuth from '../../../middlewares/sellerAuth';

const router = express();
/**
 * Create pre-signed url Api
 * */
router.post('/presignedurl', auth(), validate(s3Validation.preSignedPutUrl), s3Controller.preSignedPutUrl);

router.post('/seller-sign', sellerAuth(), validate(s3Validation.sellerSign), s3Controller.sellerSign);

router.post('/profilepic', auth(), validate(s3Validation.UserProfilePic), s3Controller.UserProfilePic);

module.exports = router;
