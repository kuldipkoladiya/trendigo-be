import httpStatus from 'http-status';
import SellerUser from '../models/sellerUser.model';
import ApiError from '../utils/ApiError';
import { tokenService, emailService } from '.';
import Token from '../models/token.model';
import { tokenTypes } from '../config/tokens';

/**
 * Register seller
 */
export const register = async (body) => {
    const { email, mobileNumber } = body;
    const existing = await SellerUser.findOne({
        $or: [{ email }, { mobileNumber }],
    });
    if (existing) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Seller already exists');
    }
    const seller = await SellerUser.create(body);

    // Send verification email
    if (email) {
        const verifyEmailToken = await tokenService.generateVerifyEmailToken(
            seller,
            'seller'
        );
        await emailService.sendVerificationEmail(email, verifyEmailToken);
    }

    return seller;
};

/**
 * Send OTP
 */
export const sendOtp = async ({ email, mobileNumber }) => {
    if (!email && !mobileNumber) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email or Mobile is required');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // store otp in db or redis
    // send otp via mail or sms
    if (email) {
        await emailService.sendOtpEmail(email, otp);
    }

    return { message: 'OTP sent successfully' };
};

/**
 * Verify OTP
 */
export const verifyOtp = async ({ email, mobileNumber, otp }) => {
    // check OTP validity from db/redis (dummy here)
    const isValid = true;
    if (!isValid) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
    }

    const seller = await SellerUser.findOne({
        $or: [{ email }, { mobileNumber }],
    });
    if (!seller) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
    }

    if (email) seller.isEmailVerified = true;
    if (mobileNumber) seller.isMobileVerifed = true;
    await seller.save();

    return { message: 'OTP verified successfully', seller };
};

/**
 * Login seller
 */
/**
 * Login with email or mobile number and password
 * @param {string} email
 * @param {string} mobileNumber
 * @param {string} countryCodeId
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
    if (!email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');
    }

    // Find seller user by email
    const user = await SellerUser.findOne({ email });
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
    }

    // Check email verification
    if (!user.isEmailVerified) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Please check your email and verify it to continue logging in to the app'
        );
    }

    return user;
};


/**
 * Refresh token
 */
export const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(
            refreshToken,
            tokenTypes.REFRESH
        );
        const seller = await SellerUser.findById(refreshTokenDoc.user);
        if (!seller) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        const tokens = await tokenService.generateAuthTokens(seller, 'seller');
        return { ...tokens };
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

/**
 * Logout seller
 */
export const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({
        token: refreshToken,
        type: tokenTypes.REFRESH,
        blacklisted: false,
    });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.remove();
};


