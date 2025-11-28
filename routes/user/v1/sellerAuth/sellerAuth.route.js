import express from 'express';
import validate from 'middlewares/validate';
import { sellerAuthValidation } from 'validations/user';
import { sellerAuthController } from 'controllers/user';
import sellerAuth from 'middlewares/sellerAuth';

const router = express.Router();

// Seller registration
router.post('/register', validate(sellerAuthValidation.register), sellerAuthController.register);

// Send OTP (email/mobile)
router.post('/resend-otp', validate(sellerAuthValidation.sendOtp), sellerAuthController.sendVerifyOtp);

// Verify OTP
router.post('/verify-otp', validate(sellerAuthValidation.verifyOtp), sellerAuthController.verifyOtp);
/**
 * update the Current UserInfo
 * /
 */
router.put('/update-user', sellerAuth(), sellerAuthController.updateUserInfo);
// Login
router.post('/login', validate(sellerAuthValidation.login), sellerAuthController.login);
/**
 * get the Current LoggedIn UserInfo
 */
router.get('/me', sellerAuth(), sellerAuthController.userInfo);
// Refresh tokens
router.post('/refresh-tokens', validate(sellerAuthValidation.refreshTokens), sellerAuthController.refreshTokens);

// Logout
router.post('/logout', validate(sellerAuthValidation.logout), sellerAuthController.logout);

export default router;
