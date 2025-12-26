import httpStatus from 'http-status';
import { generateOtp } from 'utils/common';
import ApiError from 'utils/ApiError';
import { catchAsync } from 'utils/catchAsync';
import { authService, tokenService, userService, emailService, countryCodeService } from 'services';
import { EnumTypeOfToken, EnumCodeTypeOfCode } from 'models/enum.model';
import { sendOtpToMobile } from '../../services/mobileotp.service';

export const register = catchAsync(async (req, res) => {
  const { body } = req;

  let userCountryCode = null;

  // Check for mobile number and fetch country code only if mobile number is present
  if (body.mobileNumber) {
    userCountryCode = await countryCodeService.getCountryCodeById(body.countryCodeId);
    if (!userCountryCode) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Please provide a valid countryCode while using registration with a mobile number.'
      );
    }
  }

  // Create the user object, only add countryCode if the user registered with a mobile number
  const user = await userService.createUser({
    ...body,
    ...(userCountryCode && { countryCode: userCountryCode.code }), // Only include countryCode if it's present
  });

  const otp = generateOtp();
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });
  await user.save();
  // Send OTP based on mobile or email
  if (user.mobileNumber) {
    // Send OTP to mobile via MSG91 API
    try {
      await sendOtpToMobile(`${user.countryCode}${user.mobileNumber}`, otp); // Call your function to send OTP via MSG91
      console.log('OTP sent to mobile via MSG91');
    } catch (error) {
      console.error('Error sending OTP to mobile:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error sending OTP to mobile',
      });
    }
  } else if (user.email) {
    // Send OTP to email
    try {
      await emailService.sendOtpVerificationEmail(user, otp);
      console.log('OTP sent to email');
    } catch (error) {
      console.error('Error sending OTP to email:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error sending OTP to email',
      });
    }
  }

  // Create notification for OTP
  // const createNotificationForOtp = await Notification.create({
  //   userId: user._id,
  //   body: EnumOfNotification.OTP_SEND,
  // });

  // console.log('Notification created for OTP:', createNotificationForOtp);

  // // Send notification if device tokens are present
  // if (user && user.deviceTokens && user.deviceTokens.length) {
  //   const deviceToken = user.deviceTokens.map((fcmToken) => fcmToken.deviceToken);
  //   await sendNotification(
  //     deviceToken,
  //     {
  //       data: {
  //         _id: createNotificationForOtp._id.toString(),
  //         userId: createNotificationForOtp.userId.toString(),
  //         body: EnumOfNotification.OTP_SEND,
  //         createdAt: createNotificationForOtp.createdAt.toString(),
  //         updatedAt: createNotificationForOtp.updatedAt.toString(),
  //       },
  //     },
  //     {}
  //   );
  // }

  res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'OTP has been sent to your registered mobile or email. Please verify.',
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

  // Pass both to allow fallback
  await tokenService.verifyOtp({ email, mobileNumber, otp });

  const user = await userService.getOne(email ? { email } : { mobileNumber });

  const tokens = await tokenService.generateAuthTokens(user);

  let updatedUser = user;

  if (deviceToken) {
    updatedUser = await userService.addDeviceToken(user, req.body);
  }

  // Send congratulation email
  // await emailService.sendCongratulationEmail(user);

  // Create notification in DB
  // const createNotificationForCongratulation = await Notification.create({
  //   userId: updatedUser._id,
  //   body: EnumOfNotification.CONGRATULATION,
  // });

  // Send push notification if user has device tokens
  // if (updatedUser.deviceTokens && updatedUser.deviceTokens.length) {
  //   const deviceTokens = updatedUser.deviceTokens.map((fcmToken) => fcmToken.deviceToken);
  //
  //   await sendNotification(
  //       deviceTokens,
  //       {
  //         data: {
  //           _id: createNotificationForCongratulation._id.toString(),
  //           userId: createNotificationForCongratulation.userId.toString(),
  //           body: EnumOfNotification.CONGRATULATION,
  //           createdAt: createNotificationForCongratulation.createdAt.toString(),
  //           updatedAt: createNotificationForCongratulation.updatedAt.toString(),
  //         },
  //       },
  //       {}
  //   );
  // }

  return res.status(httpStatus.OK).send({ results: { user: updatedUser, tokens } });
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
  const filter = { _id: req.user._id };
  const { body } = req;

  const userData = await userService.updateUserForAuth(
    filter,
    body,
    { returnNewDocument: true, new: true, upsert: true },
    req.user
  );
  res.status(httpStatus.OK).send({ userData });
});

export const sendVerifyOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this id!');
  }
  if (user.emailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'your email is already verified!');
  }
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000,
    used: false,
    codeType: EnumCodeTypeOfCode.LOGIN,
  });
  await user.save();
  await emailService.sendOtpVerificationEmail(user, otp).then().catch();
  res.status(httpStatus.OK).send({
    results: {
      success: true,
      message: 'Email has been sent to your registered email. Please check your email and verify it',
    },
  });
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
