import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import { TokenExpiredError } from 'jsonwebtoken';

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    if (info instanceof TokenExpiredError) {
      return reject(new ApiError(498, 'Seller Token Expired'));
    }
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate seller'));
  }

  // IMPORTANT: Check seller role
  if (user.role && user.role !== 'SELLER') {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed — Seller only route'));
  }

  req.user = user;
  resolve();
};

const sellerAuth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('seller-jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default sellerAuth;
