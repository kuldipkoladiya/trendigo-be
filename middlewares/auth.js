import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import mongoose from 'mongoose';
import { TokenExpiredError } from 'jsonwebtoken';
import { roleservice } from '../services';

const verifyCallback = (req, resolve, reject, roles) => async (err, user, info) => {
  try {
    if (err || info || !user) {
      if (info instanceof TokenExpiredError) {
        return reject(
          new ApiError(
            (httpStatus.extra && httpStatus.extra.unofficial && httpStatus.extra.unofficial.INVALID_TOKEN) || 498,
            'Token Expired'
          )
        );
      }

      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    if (roles) {
      let userRole = req.user.role;

      // If role is ObjectId then fetch role from DB
      if (mongoose.Types.ObjectId.isValid(userRole)) {
        const getRole = await roleservice.getOneRole({
          _id: userRole,
        });

        userRole = getRole ? getRole.role : null;
      }

      // Array roles check
      if (Array.isArray(roles)) {
        if (!roles.includes(userRole)) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You does not have permission to access this route!'));
        }
      }

      // Single role check
      else if (typeof roles === 'string') {
        if (userRole !== roles) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You does not have permission to access this route!'));
        }
      }
    }

    resolve();
  } catch (error) {
    reject(error);
  }
};

const auth = (roles) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.query.authToken;

    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }

    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, roles))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
