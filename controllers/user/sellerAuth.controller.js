import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { countryCodeService, emailService, sellerUserService, tokenService } from '../../services';
import { EnumCodeTypeOfCode } from '../../models/enum.model';
import ApiError from '../../utils/ApiError';
import { generateOtp } from '../../utils/common';
import * as sellerAuthService from '../../services/auth.service';
import { sendOtpToMobile } from '../../services/mobileotp.service';

export const register = catchAsync(async (req, res) => {
  const { body } = req;
  const { email, mobileNumber, countryCodeId, businessName } = body;

  // ❌ At least one is required
  if (!email && !mobileNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email or mobile number is required for seller registration.');
  }

  // 🔍 Validate businessName uniqueness
  if (businessName) {
    const existingBusiness = await sellerUserService.getOne({ businessName });
    if (existingBusiness) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Business name is already registered.');
    }
  }

  // 🔍 Validate email uniqueness
  if (email) {
    const existingEmail = await sellerUserService.getOne({ email });
    if (existingEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already registered.');
    }
  }

  // 🔍 Validate mobile uniqueness
  if (mobileNumber) {
    const existingMobile = await sellerUserService.getOne({ mobileNumber });
    if (existingMobile) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number is already registered.');
    }
  }

  // 🌍 Handle country code (only for mobile)
  let countryCode = null;
  if (mobileNumber) {
    if (!countryCodeId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'countryCodeId is required for mobile registration');
    }

    const country = await countryCodeService.getCountryCodeById(countryCodeId);
    if (!country) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid countryCodeId');
    }

    countryCode = country.code;
  }

  // 🆕 Create seller
  const seller = await sellerUserService.createSellerUser({
    ...body,
    ...(countryCode && { countryCode }),
  });

  // 🔐 Generate OTP
  const otp = generateOtp();

  seller.codes.push({
    code: String(otp),
    expirationDate: Date.now() + 10 * 60 * 1000, // 10 minutes
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });

  await seller.save();

  // 📤 Send OTP
  try {
    if (seller.mobileNumber) {
      await sendOtpToMobile(`${seller.countryCode}${seller.mobileNumber}`, otp);
    } else {
      await emailService.sendOtpVerificationEmail(seller, otp);
    }
  } catch (error) {
    console.error('OTP send error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending OTP');
  }

  return res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'OTP sent successfully. Please verify to continue.',
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
  const { otp, email, mobileNumber, deviceToken } = req.body;

  // Verify OTP
  const seller = await tokenService.verifySellerOtp({ email, mobileNumber, otp });

  // Fetch seller by email

  // Generate tokens
  const tokens = await tokenService.generateSellerTokens(seller, 'seller');

  let updatedSeller = seller;

  // Add device token if provided
  if (deviceToken) {
    updatedSeller = await sellerUserService.addDeviceToken(seller, { deviceToken });
  }

  // Send congratulation email
  // await emailService.sendCongratulationEmail(seller);

  return res.status(httpStatus.OK).send({
    results: { seller: updatedSeller, tokens },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password, mobileNumber, countryCodeId } = req.body;

  const seller = await sellerAuthService.SellerloginUserWithEmailOrMobileAndPassword(
    email,
    mobileNumber,
    countryCodeId,
    password
  );

  // Email login verification check
  if (email && !seller.isEmailVerified) {
    throw new ApiError(400, 'Please verify your email first');
  }

  // Mobile login verification check (as per your schema spelling)
  if (mobileNumber && !seller.isMobileVerifed) {
    throw new ApiError(400, 'Please verify your mobile number first');
  }

  const tokens = await tokenService.generateSellerTokens(seller);

  return res.status(200).send({
    status: 'Success',
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
