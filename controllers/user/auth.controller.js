import httpStatus from 'http-status';
import { generateOtp } from 'utils/common';
import ApiError from 'utils/ApiError';
import { catchAsync } from 'utils/catchAsync';
import { authService, tokenService, userService, emailService, countryCodeService } from 'services';
import { EnumTypeOfToken, EnumCodeTypeOfCode } from 'models/enum.model';
import { resendOtpToMobile, sendOtpToMobile } from '../../services/mobileotp.service';

export const register = catchAsync(async (req, res) => {
  const { body } = req;
  const { email, mobileNumber, countryCodeId } = body;

  let user;

  // 🔍 Find user by email or mobile
  if (email) {
    user = await userService.getOne({ email });
  } else if (mobileNumber) {
    user = await userService.getOne({ mobileNumber });
  }

  // 🌍 Handle country code (only for mobile)
  let countryCode = null;
  if (mobileNumber) {
    const country = await countryCodeService.getCountryCodeById(countryCodeId);
    if (!country) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Valid countryCodeId is required for mobile registration');
    }
    countryCode = country.code;
  }

  // 🆕 Create user if not exists
  if (!user) {
    user = await userService.createUser({
      ...body,
      ...(countryCode && { countryCode }),
    });
  }

  // 🔐 Generate OTP
  const otp = generateOtp();

  user.codes.push({
    code: String(otp),
    expirationDate: Date.now() + 10 * 60 * 1000,
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });

  await user.save();

  // 📩 Send OTP
  if (user.mobileNumber) {
    const number = await sendOtpToMobile(`${user.countryCode}${user.mobileNumber}`, otp);
    console.log('=====number====>', number);
  } else {
    await emailService.sendOtpVerificationEmail(user, otp);
  }

  return res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'OTP sent successfully. Please verify to continue.',
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { deviceToken } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  if (deviceToken) {
    const updatedUser = await userService.addDeviceToken(user, req.body);
    res.status(httpStatus.OK).send({ results: { user: updatedUser, tokens } });
  } else {
    res.status(httpStatus.OK).send({ results: { user, tokens } });
  }
});

// if user's email is not verified then we call this function for reverification
export const sendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const emailVerifyToken = await tokenService.generateVerifyEmailToken(email);
  const user = await userService.getOne({ email });
  emailService.sendEmailVerificationEmail(user, emailVerifyToken, 'user').then().catch();
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Email has been sent to your registered email. Please check your email and verify it',
  });
});

/**
 * Token-based forgotPassword Verify Controller
 * @type {(request.query: token)}
 * @return (successMessage)
 */
export const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query);
  res.status(httpStatus.OK).send({ message: 'Your Email is Verified Successfully' });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(httpStatus.OK).send({ results: { success: true, message: 'Code has been sent' } });
});

/**
 * Token-based forgotPassword Controller
 * @type {(function(*, *, *): void)|*}
 */
export const forgotPasswordToken = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send({ success: true, message: 'Reset password link is sent to your email successfully' });
});

/**
 * Token-based forgotPassword Verify Controller
 * @type {(function(*, *, *): void)|*}
 */
export const verifyResetCode = catchAsync(async (req, res) => {
  req.body.type = EnumTypeOfToken.RESET_PASSWORD;
  await tokenService.verifyCode(req.body);
  res.status(httpStatus.OK).send({ success: true });
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { otp, email, mobileNumber, deviceToken } = req.body;

  const user = await tokenService.verifyOtp({ email, mobileNumber, otp });

  const tokens = await tokenService.generateAuthTokens(user);

  let updatedUser = user;

  if (deviceToken) {
    updatedUser = await userService.addDeviceToken(user, req.body);
  }

  return res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'Login successful',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber,
      },
      tokens,
    },
  });
});

export const resetPasswordOtp = catchAsync(async (req, res) => {
  await authService.resetPasswordOtp(req.body);
  res.status(httpStatus.OK).send({ results: { success: true, message: 'Password has been reset successfully' } });
});

export const resetPasswordOtpVerify = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await tokenService.verifyResetOtpVerify(email, otp);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something is went wrong!');
  }
  res.status(httpStatus.OK).send({ results: { success: true } });
});

/**
 * Token-based resetPassword Controller
 * @type {(function(*, *, *): void)|*}
 */
export const resetPasswordToken = catchAsync(async (req, res) => {
  await authService.resetPasswordToken(req.body);
  res.status(httpStatus.OK).send({ success: true, message: 'Password has been reset successfully' });
});

export const userInfo = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  res.status(httpStatus.OK).send({ results: { user } });
});

/**
 * Update the userInfo when he is LoggedIn
 * @type {(function(*, *, *): void)|*}
 */
export const updateUserInfo = catchAsync(async (req, res) => {
  const { user } = req;
  const { email, mobileNumber, countryCodeId, ...otherFields } = req.body;

  /* ---------------- NORMAL FIELDS ---------------- */
  if (Object.keys(otherFields).length) {
    await userService.updateUserForAuth({ _id: user._id }, otherFields, { new: true }, user);
  }

  /* ---------------- EMAIL UPDATE ---------------- */
  if (email && email !== user.email) {
    const exists = await userService.getOne({
      email,
      _id: { $ne: user._id },
    });

    if (exists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const otp = generateOtp();

    user.codes.push({
      code: String(otp),
      codeType: EnumCodeTypeOfCode.EMAIL,
      expirationDate: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });

    user.pendingEmail = email;
    await user.save();

    await emailService.sendOtpVerificationEmail({ email }, otp);

    return res.status(httpStatus.OK).send({
      message: 'OTP sent to email. Please verify.',
      verifyType: 'email',
    });
  }

  /* ---------------- MOBILE UPDATE ---------------- */
  if (mobileNumber && mobileNumber !== user.mobileNumber) {
    const country = await countryCodeService.getCountryCodeById(countryCodeId);
    if (!country) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Valid countryCodeId required');
    }

    const otp = generateOtp();

    user.codes.push({
      code: String(otp),
      codeType: EnumCodeTypeOfCode.MOBILE,
      expirationDate: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });

    user.pendingMobileNumber = mobileNumber;
    user.pendingCountryCode = country.code;

    await user.save();

    await sendOtpToMobile(`${country.code}${mobileNumber}`, otp);

    return res.status(httpStatus.OK).send({
      message: 'OTP sent to mobile. Please verify.',
      verifyType: 'mobile',
    });
  }

  return res.status(httpStatus.OK).send({
    message: 'Profile updated successfully',
  });
});

export const sendVerifyOtp = catchAsync(async (req, res) => {
  const { email, mobileNumber, countryCodeId } = req.body;
  // Ensure email or mobileNumber is provided in the request
  if (!email && !mobileNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email or mobile number is required.');
  }
  // Fetch the user based on email or mobileNumber from the body
  const searchCondition = email
    ? { email: { $regex: `^${email}$`, $options: 'i' } } // Case-insensitive exact match
    : { mobileNumber };

  // Fetch user
  const user = await userService.getOne(searchCondition);
  // If user not found, throw an error
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No user found with this email or mobile number!');
  }

  // Generate OTP
  const otp = generateOtp();

  // Push the new OTP to the user's codes
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });

  // Save the user document
  await user.save();

  // Handle mobile-based OTP
  if (mobileNumber) {
    const userCountryCode = await countryCodeService.getCountryCodeById(countryCodeId);
    if (!userCountryCode) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide countryCode while using registration with Mobile number.');
    }

    try {
      await resendOtpToMobile(`${userCountryCode.code}${user.mobileNumber}`, otp);
      console.log('OTP resent to mobile');
      return res.status(httpStatus.OK).send({
        results: {
          success: true,
          message: 'OTP has been resent to your mobile number. Please verify.',
        },
      });
    } catch (error) {
      console.error('Error resending OTP to mobile:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error resending OTP to mobile',
      });
    }
  } else if (email) {
    // Handle email-based OTP
    try {
      await emailService.sendOtpVerificationEmail(user, otp);
      console.log('OTP sent to email');
      return res.status(httpStatus.OK).send({
        results: {
          success: true,
          message: 'OTP has been resent to your registered email. Please verify.',
        },
      });
    } catch (error) {
      console.error('Error sending OTP to email:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error sending OTP to email',
      });
    }
  }
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send({ results: { ...tokens } });
});

export const logout = catchAsync(async (req, res) => {
  const { user } = req;
  const { deviceToken } = req.body;
  if (deviceToken) {
    user.deviceTokens = user.deviceTokens.filter((token) => token !== deviceToken);
    await user.save();
  }
  await tokenService.invalidateToken(req.body);
  res.status(httpStatus.OK).send({ results: { success: true } });
});

export const socialLogin = catchAsync(async (req, res) => {
  const user = await authService.socialLogin(req.user);
  const token = await tokenService.generateAuthTokens(req.user);
  res.status(httpStatus.OK).send({ results: { user, token } });
});

export const registerDeviceToken = catchAsync(async (req, res) => {
  const { user, body } = req;
  if (body.deviceToken) {
    const updatedUser = await userService.addDeviceToken(user, body);
    res.status(httpStatus.OK).send({ results: updatedUser });
  } else {
    res.status(httpStatus.OK).send({ results: user });
  }
});

export const updateDeviceToken = catchAsync(async (req, res) => {
  const { user, body } = req;
  const { deviceToken } = req.body;
  if (deviceToken) {
    const updatedUser = await userService.addDeviceToken(user, body);
    res.status(httpStatus.OK).send({ results: updatedUser });
  } else {
    res.status(httpStatus.OK).send({ results: user });
  }
});

export const updateEmailAndMobile = catchAsync(async (req, res) => {
  const { email, mobileNumber } = req.body;
  const { user } = req;
  if (email && email.currentEmail !== user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'your current email is wrong. please add right current email');
  }
  if (email && email.newEmail === user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'your new email can not be same as your old email');
  }
  if (mobileNumber && mobileNumber.currentMobileNumber !== user.mobileNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'your current mobile number is wrong. please add right current number');
  }
  if (mobileNumber && mobileNumber.newMobileNumber === user.mobileNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'your new mobile number can not be same as your old mobile number');
  }
  await authService.updateEmailAndMobile({ email, mobileNumber, user });
  res.status(httpStatus.OK).send({ results: { success: true, message: 'otp send successfully' } });
});

export const verifyEmailAndMobile = catchAsync(async (req, res) => {
  const { email, mobileNumber } = req.body;
  const { user } = req;
  // const result =
  await authService.verifyOtpForUpdatePasswordEnaEmail({ email, mobileNumber, user });
  res.status(httpStatus.OK).send({ results: { success: true, message: 'reset successfully' } });
});

export const verifyUpdateOtp = catchAsync(async (req, res) => {
  const { user } = req;
  const { otp, type } = req.body;

  const otpCode = user.codes.find(
    (c) => c.code === String(otp) && c.codeType === type && !c.used && c.expirationDate > new Date()
  );

  if (!otpCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  otpCode.used = true;

  /* ---------- APPLY VERIFIED UPDATE ---------- */
  if (type === EnumCodeTypeOfCode.EMAIL_VERIFY) {
    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailVerified = true;
  }

  if (type === EnumCodeTypeOfCode.MOBILE_VERIFY) {
    user.mobileNumber = user.pendingMobileNumber;
    user.countryCode = user.pendingCountryCode;
    user.pendingMobileNumber = null;
    user.pendingCountryCode = null;
    user.isMobileVerifed = true;
  }

  await user.save();

  return res.status(httpStatus.OK).send({
    message: 'OTP verified & profile updated successfully',
    user,
  });
});
