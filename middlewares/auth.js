import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import mongoose from 'mongoose';
import { TokenExpiredError } from 'jsonwebtoken';
import { roleservice } from '../services';

const verifyCallback = (req, resolve, reject, roles) => async (err, user, info) => {
  try {
    // Token / Auth check
    if (err || info || !user) {
      if (info instanceof TokenExpiredError) {
        return reject(new ApiError(498, 'Token Expired'));
      }

      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    // Role check
    if (roles) {
      let userRole = req.user.role;

      console.log('REQ USER =>', req.user);
      console.log('USER ROLE =>', userRole);
      console.log('ROLES =>', roles);

      // If role object comes from JWT
      // Example:
      // role: { _id: "...", role: "user" }

      if (userRole && typeof userRole === 'object' && userRole.role) {
        userRole = userRole.role;
      }

      // If role is ObjectId then fetch role from DB
      if (userRole && typeof userRole === 'string' && mongoose.Types.ObjectId.isValid(userRole)) {
        const getRole = await roleservice.getOneRole({
          _id: userRole,
        });

        if (!getRole) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Role not found'));
        }

        userRole = getRole.role;
      }

      // Convert role to lowercase
      userRole = String(userRole).toLowerCase();

      // Multiple roles
      if (Array.isArray(roles)) {
        const normalizedRoles = roles.map((r) => String(r).toLowerCase());

        if (!normalizedRoles.includes(userRole)) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You do not have permission to access this route!'));
        }
      }

      // Single role
      else if (typeof roles === 'string') {
        if (userRole !== String(roles).toLowerCase()) {
          return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You do not have permission to access this route!'));
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
    // Extract token
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.query.authToken;

    // Set token in header
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }

    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, roles))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
