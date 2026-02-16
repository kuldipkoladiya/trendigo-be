import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import _ from 'lodash';
import { User, Token, SellerUser } from 'models';
import { userService, tokenService, emailService, countryCodeService, sellerUserService } from 'services';
import { EnumTypeOfToken, EnumCodeTypeOfCode } from 'models/enum.model';
import bcrypt from 'bcryptjs';
import { generateOtp } from 'utils/common';
import { sendOtpToMobile } from './mobileotp.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  if (!user.emailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please check your email and verify it to continue login in to app');
  }
  return user;
};
export const SellerloginUserWithEmailOrMobileAndPassword = async (email, mobileNumber, countryCodeId, password) => {
  let seller;

  // 🔐 Email login
  if (email) {
    seller = await SellerUser.findOne({ email }).select('+password');
  }

  // 📱 Mobile login
  else if (mobileNumber && countryCodeId) {
    const countryCode = await countryCodeService.getCountryCodeById(countryCodeId);
    if (!countryCode) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid country code');
    }

    seller = await SellerUser.findOne({
      mobileNumber,
      countryCode: countryCode.code,
    }).select('+password');
  }

  // ❌ Missing credentials
  else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email or mobile number is required');
  }

  // ❌ Seller not found
  if (!seller) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }

  // ⚠️ Password not set (OTP-only account)
  if (!seller.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password not set. Login using OTP.');
  }

  // 🔑 Password check
  const isValid = await bcrypt.compare(password, seller.password);
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }

  // ✅ Verification check
  if ((email && !seller.isEmailVerified) || (mobileNumber && !seller.isMobileVerified)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please verify your account before login');
  }

  return seller;
};
export const verifyEmail = async (verifyRequest) => {
  const { token } = verifyRequest;
  const verifyEmailTokenDoc = await tokenService.verifyToken(token, EnumTypeOfToken.VERIFY_EMAIL);
  const { user } = verifyEmailTokenDoc;
  await Token.deleteMany({ user, type: EnumTypeOfToken.VERIFY_EMAIL });
  const filter = {
    _id: user,
  };
  return userService.updateUser(filter, { emailVerified: true });
};

/**
 * forgotPassword with Email
 * @param {string} email
 * @returns {Promise<User>}
 */
export const forgotPassword = async (email) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this email');
  }
  const otp = generateOtp();
  user.codes.push({
    code: otp,
    expirationDate: Date.now() + 10 * 60 * 1000,
    used: false,
    codeType: EnumCodeTypeOfCode.RESETPASSWORD,
  });
  await user.save();
  await emailService.sendResetPasswordEmail(email, otp);
  return user;
};

export const resetPasswordOtp = async (resetPasswordRequest) => {
  const { email, otp, password } = resetPasswordRequest;
  const user = await tokenService.verifyResetOtp(email, otp);
  const filter = {
    _id: user._id,
  };
  return userService.updateUser(filter, { password });
};

/**
 * Reset password Token-based Service
 * @returns {Promise}
 * @param resetPasswordRequest
 * @param {string} [resetPasswordRequest.password]
 * @param {string} [resetPasswordRequest.code]
 * @param {string} [resetPasswordRequest.email]
 */
export const resetPasswordToken = async (resetPasswordRequest) => {
  const { email, code, password } = resetPasswordRequest;
  const resetPasswordTokenDoc = await tokenService.verifyCode({
    email,
    type: EnumTypeOfToken.RESET_PASSWORD,
    code,
  });
  const { user } = resetPasswordTokenDoc;
  await Token.deleteMany({ user, type: EnumTypeOfToken.RESET_PASSWORD });
  const filter = {
    _id: user._id,
  };
  return userService.updateUser(filter, { password });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
  try {
    console.log('🔄 [refreshAuth] Incoming refresh token:', refreshToken);

    // 1️⃣ Verify refresh token
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, EnumTypeOfToken.REFRESH);

    console.log('✅ [refreshAuth] Refresh token verified:', {
      id: refreshTokenDoc._id,
      user: refreshTokenDoc.user,
      expires: refreshTokenDoc.expires,
    });

    // 2️⃣ Fetch user
    const user = await userService.getUserById(refreshTokenDoc.user);

    console.log('👤 [refreshAuth] User lookup result:', user ? user._id : null);

    if (!user) {
      console.error('❌ [refreshAuth] User not found for token user id');
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');
    }

    // 3️⃣ Remove used refresh token
    await refreshTokenDoc.remove();
    console.log('🗑️ [refreshAuth] Old refresh token removed');

    // 4️⃣ Generate new tokens
    const newTokens = await tokenService.generateAuthTokens(user);
    console.log('🎉 [refreshAuth] New auth tokens generated');

    return newTokens;
  } catch (error) {
    console.error('🚨 [refreshAuth] Error occurred:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * check whether user is being created from the method createSocialUser if not then throw the Error
 * @param user
 * @returns {Promise<*>}
 */
export const socialLogin = async (user) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid SingIn');
  }
  return user;
};

/**
 * Create the Social user like Facebook, google and Apple Login
 * @param accessToken
 * @param refreshToken
 * @param profile
 * @param provider
 * @returns {Promise<*>}
 */
export const createSocialUser = async (accessToken, refreshToken, profile, provider) => {
  const query = {};
  const userObj = {};
  /**
   * If provider is facebook then save the details of user in db.
   */
  if (provider === 'facebook') {
    query.$or = [{ 'facebookProvider.id': profile.id }, { email: profile.emails[0].value }];
    const userFullName = profile.displayName.split(' ');
    const [firstName, lastName] = userFullName;
    userObj.name = firstName;
    userObj.lastName = lastName || '';
    userObj.email = profile.emails[0].value;
    userObj.facebookProvider = {
      id: profile.id,
      token: accessToken,
    };
    userObj.emailVerified = true;
  }
  /**
   * If provider is google then save the details of user in db.
   */
  if (provider === 'google') {
    query.$or = [{ 'googleProvider.id': profile.id }, { email: profile.emails[0].value }];
    const userFullName = profile.displayName.split(' ');
    const [firstName, lastName] = userFullName;
    userObj.name = firstName;
    userObj.lastName = lastName || '';
    userObj.email = profile.emails[0].value;
    userObj.googleProvider = {
      id: profile.id,
      token: accessToken,
    };
    userObj.emailVerified = true;
  }
  /**
   * If provider is github then save the details of user in db.
   */
  if (provider === 'github') {
    if (_.isEmpty(profile.emails[0].value)) {
      throw new ApiError(
        'Your gitHub email is private please make it public if you want to login with gitHub!',
        httpStatus.BAD_REQUEST
      );
    }
    query.$or = [{ 'githubProvider.id': profile.id }, { email: profile.emails[0].value }];
    // here if user has name and email in displayName and json then first it checks for that
    // otherwise it takes value as default value as we give.
    const userFullName = profile.displayName ? profile.displayName.split(' ') : [];
    const [firstName, lastName] = userFullName;
    userObj.name = firstName || profile.username;
    userObj.lastName = lastName || '';
    userObj.email = profile._json.email ? profile._json.email : profile.emails[0].value;
    userObj.active = true;
    userObj.githubProvider = {
      id: profile.id,
      token: accessToken,
    };
    userObj.emailVerified = true;
  }
  /**
   * If provider is apple then save the details of user in db.
   */
  if (provider === 'apple') {
    if (_.isEmpty(profile.emails[0].value)) {
      throw new ApiError(
        'Your apple account email is private please make it public if you want to login with apple!',
        httpStatus.BAD_REQUEST
      );
    }
    query.$or = [{ 'appleProvider.id': profile.sub }, { email: profile.email }];
    userObj.name = profile.email.split('@')[0] || '';
    userObj.email = profile.email;
    userObj.appleProvider = {
      id: profile.sub,
      token: accessToken,
    };
    userObj.emailVerified = true;
  }
  userObj.password = Math.random().toString(36).slice(-10);
  return User.findOne(query).then(async (user) => {
    if (!user) {
      const newUser = new User(userObj);
      return newUser.save();
    }
    if (provider === 'facebook') {
      user.facebookProvider = userObj.facebookProvider; // eslint-disable-line no-param-reassign
    }
    if (provider === 'google') {
      user.googleProvider = userObj.googleProvider; // eslint-disable-line no-param-reassign
    }
    if (provider === 'github') {
      // eslint-disable-next-line no-param-reassign
      user.githubProvider = userObj.githubProvider;
    }
    if (provider === 'apple') {
      user.appleProvider = userObj.appleProvider; // eslint-disable-line no-param-reassign
    }
    return User.findOneAndUpdate({ _id: user._id }, user, {
      new: true,
      upsert: true,
    });
  });
};

export const updateEmailAndMobile = async ({ email, mobileNumber, user }) => {
  const otp = generateOtp();
  const body = {
    $push: {
      codes: {
        code: otp,
        expirationDate: Date.now() + 10 * 60 * 1000,
        used: false,
        codeType: EnumCodeTypeOfCode.RESET_LOGIN_CRED,
      },
    },
  };
  if (email && email.currentEmail === user.email) {
    await userService.updateUser({ email: user.email }, body, { new: true });
    await emailService.sendResetEmailOtp(email.newEmail, otp, 'Email');
    // create jwt payload with otp data
  }
  if (mobileNumber && mobileNumber.currentMobileNumber === user.mobileNumber) {
    try {
      await userService.updateUser({ mobileNumber: user.mobileNumber }, body, { new: true });
      await sendOtpToMobile(`${user.countryCode}${mobileNumber.newMobileNumber}`, otp);
      console.log('OTP sent to mobile via MSG91');
    } catch (error) {
      console.error('Error sending OTP to mobile:', error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending OTP to mobile');
    }
  }
  return user;
};

export const verifyOtpForUpdatePasswordEnaEmail = async ({ email, mobileNumber, user }) => {
  // console.log('=== var mobileNumber ===>', mobileNumber);

  // Handle email update
  if (email && email.currentEmail === user.email) {
    // verify email OTP
    await tokenService.verifyResetOtpForChangeEmailOrNumber(user, email.otp);

    // update email
    await userService.updateUser({ _id: user._id }, { email: email.newEmail });
  }

  // Handle mobile number update
  if (mobileNumber && mobileNumber.currentMobileNumber === user.mobileNumber) {
    // verify mobile OTP
    await tokenService.verifyResetOtpForChangeEmailOrNumber(user, mobileNumber.otp);

    // update mobile number
    await userService.updateUser({ _id: user._id }, { mobileNumber: mobileNumber.newMobileNumber });
  }

  return user;
};

export const updateSellerEmailAndMobile = async ({ email, mobileNumber, seller }) => {
  const otp = generateOtp();

  const updateBody = {
    $push: {
      codes: {
        code: otp,
        expirationDate: Date.now() + 10 * 60 * 1000,
        used: false,
        codeType: EnumCodeTypeOfCode.RESET_LOGIN_CRED,
      },
    },
  };

  // Email OTP
  if (email && email.currentEmail === seller.email) {
    await sellerUserService.updateSellerUser({ _id: seller._id }, updateBody);

    await emailService.sendResetEmailOtp(email.newEmail, otp, 'Seller Email');
  }

  // Mobile OTP
  if (mobileNumber && String(mobileNumber.currentMobileNumber) === String(seller.mobileNumber)) {
    await sellerUserService.updateSellerUser({ _id: seller._id }, updateBody);

    await sendOtpToMobile(`${seller.countryCode}${mobileNumber.newMobileNumber}`, otp);
  }

  return seller;
};

export const verifySellerOtpForUpdateEmailAndMobile = async ({ email, mobileNumber, seller }) => {
  // Email verify
  if (email && email.currentEmail === seller.email) {
    await tokenService.verifyResetOtpForChangeEmailOrNumber(seller, email.otp);

    await sellerUserService.updateSellerUser(
      { _id: seller._id },
      {
        email: email.newEmail,
        isEmailVerified: true,
      }
    );
  }

  // Mobile verify
  if (mobileNumber && String(mobileNumber.currentMobileNumber) === String(seller.mobileNumber)) {
    await tokenService.verifyResetOtpForChangeEmailOrNumber(seller, mobileNumber.otp);

    await sellerUserService.updateSellerUser(
      { _id: seller._id },
      {
        mobileNumber: mobileNumber.newMobileNumber,
        isMobileVerifed: true, // use your schema spelling
      }
    );
  }

  return seller;
};
