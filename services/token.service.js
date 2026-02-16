import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import { Token } from 'models';
import ApiError from 'utils/ApiError';
import config from 'config/config';
import _ from 'lodash';
import { sellerUserService, userService } from 'services';
import { EnumTypeOfToken, EnumCodeTypeOfCode } from 'models/enum.model';
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
export const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token, type) => {
  const secretOrPublicKey = config.jwt.secret;
  const payload = jwt.verify(token, secretOrPublicKey, { ignoreExpiration: true });
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Token');
  }
  return tokenDoc;
};

/**
 * Verify Code
 * @returns {Promise<Token>}
 * @param verificationRequest
 * @param {string} [verificationRequest.token]
 * @param {string} [verificationRequest.type]
 * @param {string} [verificationRequest.user]
 */
export const verifyCode = async (verificationRequest) => {
  const { code: token, type, email } = verificationRequest;
  const userObj = await userService.getOne({ email });
  if (!userObj) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No such User');
  }
  const tokenDoc = await Token.findOne({ token, type, user: userObj._id });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect code');
  }
  return tokenDoc;
};

export const verifyOtp = async ({ email, mobileNumber, otp }) => {
  console.log('➡️ verifyOtp called');

  let user;

  if (email) {
    user = await userService.getOne({ email });
  } else if (mobileNumber) {
    user = await userService.getOne({ mobileNumber });
  }

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No user found with this email or mobile number');
  }

  const otpValue = String(otp).trim();

  const otpCode = user.codes.find(
    (code) => String(code.code).trim() === otpValue && code.codeType === EnumCodeTypeOfCode.LOGIN
  );

  if (!otpCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (new Date(otpCode.expirationDate).getTime() < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
  }

  // 🗑 Remove used OTP
  user.codes = user.codes.filter(
    (code) => !(String(code.code).trim() === otpValue && code.codeType === EnumCodeTypeOfCode.LOGIN)
  );

  // ✅ Activate user
  user.emailVerified = true;
  user.active = true;

  await user.save();

  return user;
};
export const verifySellerOtp = async ({ email, mobileNumber, otp }) => {
  console.log('➡️ verifySellerOtp called');

  let seller;

  // 🔍 Find seller by email or mobile
  if (email) {
    seller = await sellerUserService.getOne({ email });
  } else if (mobileNumber) {
    seller = await sellerUserService.getOne({ mobileNumber });
  }

  if (!seller) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No seller found with this email or mobile number');
  }

  // ⚠️ Already verified check
  if ((email && seller.isEmailVerified) || (mobileNumber && seller.isMobileVerified)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account already verified');
  }

  // 🔐 Normalize OTP
  const otpValue = String(otp).trim();

  // 🔎 Find valid OTP
  const otpCode = seller.codes.find(
    (code) => String(code.code).trim() === otpValue && code.codeType === EnumCodeTypeOfCode.LOGIN
  );

  if (!otpCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (new Date(otpCode.expirationDate).getTime() < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
  }

  // 🗑 Remove only used OTP
  seller.codes = seller.codes.filter(
    (code) => !(String(code.code).trim() === otpValue && code.codeType === EnumCodeTypeOfCode.LOGIN)
  );

  // ✅ Mark verified & activate
  if (email) seller.isEmailVerified = true;
  if (mobileNumber) seller.isMobileVerified = true;

  seller.active = true;

  await seller.save();

  return seller;
};
/**
 * Generate token
 * @returns {string}
 * @param length
 */
const generateCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
};
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateCode(config.jwt.resetPasswordCodeSize);
  await Token.deleteMany({ user, type: EnumTypeOfToken.RESET_PASSWORD });
  await saveToken(resetPasswordToken, user.id, expires, EnumTypeOfToken.RESET_PASSWORD);
  return resetPasswordToken;
};

export const verifyResetOtp = async (email, otp) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this email');
  }
  // eslint-disable-next-line eqeqeq
  const otpCode = _.find(user.codes, (code) => code.code === otp && code.codeType === EnumCodeTypeOfCode.RESETPASSWORD);
  if (!otpCode || otpCode.expirationDate < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'otp is Invalid');
  }
  user.codes = _.filter(user.codes, (code) => code.code !== otp);
  await user.save();
  return user;
};

export const verifyResetOtpVerify = async (email, otp) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this email');
  }
  // eslint-disable-next-line eqeqeq
  const otpCode = _.find(user.codes, (code) => code.code == otp && code.codeType === EnumCodeTypeOfCode.RESETPASSWORD);
  if (!otpCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'otp is Invalid');
  }
  if (otpCode.expirationDate < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'otp is expired');
  }
  user.codes = _.filter(user.codes, (code) => code.code !== otp);
  await user.save();
  return user;
};

/**
 * Generate Verify email token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (email) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  } else if (user.emailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already Verified');
  }
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const token = generateToken(user.id, expires);
  await Token.deleteMany({ user, type: EnumTypeOfToken.VERIFY_EMAIL });
  await saveToken(token, user.id, expires, EnumTypeOfToken.VERIFY_EMAIL);
  return token;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires, EnumTypeOfToken.REFRESH);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
export const generateSellerTokens = async (seller) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(seller.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(seller.id, refreshTokenExpires);

  await saveToken(refreshToken, seller.id, refreshTokenExpires, EnumTypeOfToken.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Get auth tokens
 * @param {User} user
 * @param token
 * @returns {Promise<Object>}
 */
export const getAuthTokens = async (user, token) => {
  const tokenDoc = await Token.findOne({ type: EnumTypeOfToken.REFRESH, user: user.id });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  const { exp } = jwt.verify(token, config.jwt.secret);
  return {
    access: {
      token,
      expires: moment.unix(exp).toDate(),
    },
    refresh: {
      token: tokenDoc.token,
      expires: tokenDoc.expires,
    },
  };
};

/**
 * @returns {Promise<*>}
 * @param {Object}  invalidReq
 */
export const invalidateToken = async (invalidReq) => {
  const { refreshToken: token } = invalidReq;
  const tokenDoc = await Token.findOne({ type: EnumTypeOfToken.REFRESH, token });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  } else {
    return Token.findByIdAndDelete(tokenDoc._id);
  }
};

export const generatesellerVerifyEmailToken = async (email) => {
  const user = await sellerUserService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  } else if (user.emailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already Verified');
  }
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const token = generateToken(user.id, expires);
  await Token.deleteMany({ user, type: EnumTypeOfToken.VERIFY_EMAIL });
  await saveToken(token, user.id, expires, EnumTypeOfToken.VERIFY_EMAIL);
  return token;
};

export const verifyResetOtpForChangeEmailOrNumber = async (account, otp, codeType = EnumCodeTypeOfCode.RESET_LOGIN_CRED) => {
  const otpValue = otp.toString().trim();

  // Find OTP index
  const otpCodeIndex = account.codes.findIndex(
    (code) => code.code.toString().trim() === otpValue && code.codeType === codeType
  );

  // Invalid OTP
  if (otpCodeIndex === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  const otpCode = account.codes[otpCodeIndex];

  // Expired OTP
  if (otpCode.expirationDate < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  // Remove used OTP
  account.codes.splice(otpCodeIndex, 1);

  // Tell mongoose codes modified
  account.markModified('codes');

  // Save document (works for both User and Seller)
  await account.save();

  return true;
};
