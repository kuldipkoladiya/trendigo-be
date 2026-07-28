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
/**
 * OTP-based verification
 * When User Forgot to Password call this API and he gets the OTP in his Email to reset Password
 */
router.post('/forgot-password', validate(sellerAuthValidation.forgotPassword), sellerAuthController.forgotPassword);
/**
 * OTP-based verification
 * verify that OTP is for changePassword is Valid.
 */
router.post(
  '/verify-reset-otp',
  validate(sellerAuthValidation.resetPasswordOtpVerify),
  sellerAuthController.resetPasswordOtpVerify
);
/**
 * OTP-based verification
 * Reset the password Using the OTP and Email provided by User.
 */
router.post('/reset-password', validate(sellerAuthValidation.resetPasswordOtp), sellerAuthController.resetPasswordOtp);
// Refresh tokens
router.post('/refresh-tokens', validate(sellerAuthValidation.refreshTokens), sellerAuthController.refreshTokens);

// Logout
router.post('/logout', validate(sellerAuthValidation.logout), sellerAuthController.logout);
/**
 * update password of user
 */
router.put('/update-password', sellerAuth(), validate(sellerAuthValidation.updatepss), sellerAuthController.updatepsss);
/**
 * send otp for change email and mobile number
 *
 */
router.post(
  '/send-otp-change-email',
  sellerAuth(),
  validate(sellerAuthValidation.updateSellerEmailAndMobile),
  sellerAuthController.updateSellerEmailAndMobile
);

/**
 * verify otp for change email and number
 *
 */
router.post(
  '/verify-otp-change-email',
  sellerAuth(),
  validate(sellerAuthValidation.verifySellerEmailAndMobile),
  sellerAuthController.verifySellerEmailAndMobile
);
export default router;
