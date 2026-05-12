import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import { TokenExpiredError } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { roleservice } from '../services';

const verifyCallback = (req, resolve, reject, roles) => async (err, user, info) => {
  try {
    if (err || info || !user) {
      if (info instanceof TokenExpiredError) {
        return reject(new ApiError(httpStatus.extra.unofficial.INVALID_TOKEN, 'Token Expired'));
      }

      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    if (roles) {
      // validate ObjectId before query
      if (!mongoose.Types.ObjectId.isValid(req.user.role)) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid role id'));
      }

      const getRole = await roleservice.getOneRole({
        _id: req.user.role,
      });

      if (!getRole) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Role not found'));
      }

      // FIXED TYPO HERE
      if (Array.isArray(roles)) {
        if (!roles.includes(getRole.role)) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You do not have permission to access this route!'));
        }
      } else if (typeof roles === 'string') {
        if (getRole.role !== roles) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You do not have permission to access this route!'));
        }
      }
    }

    resolve();
  } catch (error) {
    reject(error);
  }
};

const auth = (role) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, role))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
