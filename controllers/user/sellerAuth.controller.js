import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { emailService, sellerUserService, tokenService } from '../../services';
import { EnumCodeTypeOfCode } from '../../models/enum.model';
import ApiError from '../../utils/ApiError';
import { generateOtp } from '../../utils/common';
import * as sellerAuthService from '../../services/auth.service';

export const register = catchAsync(async (req, res) => {
  const { body } = req;

  // Email is mandatory for seller
  if (!body.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required for seller registration.');
  }

  // Create seller
  const seller = await sellerUserService.createSellerUser(body);

  // Generate OTP and attach to seller
  const otp = generateOtp();
  seller.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });
  await seller.save();

  // Send OTP via email
  try {
    await emailService.sendOtpVerificationEmail(seller, otp);
    console.log('OTP sent to seller email');
  } catch (error) {
    console.error('Error sending OTP to seller email:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error sending OTP to email',
    });
  }
  res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'OTP has been sent to your registered email. Please verify.',
    },
  });
});

export const sendVerifyOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  // ✅ Require email
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required.');
  }

  // ✅ Case-insensitive search by email
  const user = await sellerUserService.getOne({
    email: { $regex: `^${email}$`, $options: 'i' },
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No seller found with this email!');
  }

  // ✅ Generate new OTP
  const otp = generateOtp();

  // Push OTP into seller's codes
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000, // OTP valid 10 min
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });

  await user.save();

  // ✅ Send OTP via email
  try {
    await emailService.sendOtpVerificationEmail(user, otp);
    console.log('OTP resent to seller email');

    return res.status(httpStatus.OK).send({
      results: {
        success: true,
        message: 'OTP has been resent to your registered email. Please verify.',
      },
    });
  } catch (error) {
    console.error('Error resending OTP to seller email:', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: 'Error sending OTP to email',
    });
  }
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { otp, email, deviceToken } = req.body;

  if (!email || !otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email and OTP are required.');
  }

  // Verify OTP
  await tokenService.verifySellerOtp(email, otp);

  // Fetch seller by email
  const seller = await sellerUserService.getOne({ email });
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found.');
  }

  // Generate tokens
  const tokens = await tokenService.generateSellerTokens(seller, 'seller');

  let updatedSeller = seller;

  // Add device token if provided
  if (deviceToken) {
    updatedSeller = await sellerUserService.addDeviceToken(seller, { deviceToken });
  }

  // Send congratulation email
  await emailService.sendCongratulationEmail(seller);

  return res.status(httpStatus.OK).send({
    results: { seller: updatedSeller, tokens },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const seller = await sellerAuthService.SellerloginUserWithEmailAndPassword(email, password);
  if (!seller.isEmailVerified) {
    throw new ApiError(400, 'Please verify your email first');
  }

  const tokens = await tokenService.generateSellerTokens(seller);

  return res.status(200).send({
    results: {
      seller,
      tokens,
    },
  });
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await sellerAuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

export const logout = catchAsync(async (req, res) => {
  await sellerAuthService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const updateUserInfo = catchAsync(async (req, res) => {
  const filter = { _id: req.user._id };
  const { body } = req;

  const userData = await sellerUserService.updatesellerUserForAuth(
    filter,
    body,
    { returnNewDocument: true, new: true, upsert: true },
    req.user
  );
  res.status(httpStatus.OK).send({ userData });
});

export const userInfo = catchAsync(async (req, res) => {
  const user = await sellerUserService.getSellerUserById(req.user._id);
  res.status(httpStatus.OK).send({ results: { user } });
});
