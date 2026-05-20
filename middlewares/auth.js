import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';
import { TokenExpiredError } from 'jsonwebtoken';
import { roleservice } from '../services';

const EnumRoleOfUser = {
  USER: 'user',
  ADMIN: 'admin',
  PROJECT_OWNER: 'project-owner',
  SUPER_ADMIN: 'super-admin',
  CO_ADMIN: 'co-admin',
};

const verifyCallback = (req, resolve, reject, roles) => async (err, user, info) => {
  if (err || info || !user) {
    if (info instanceof TokenExpiredError) {
      return reject(new ApiError(httpStatus.extra.unofficial.INVALID_TOKEN, 'Token Expired'));
    }

    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = user;

  // DEFAULT ROLE
  let userRole = EnumRoleOfUser.USER;

  // IF USER HAS ROLE ID
  if (req.user.role) {
    const getRole = await roleservice.getOneRole({
      _id: req.user.role,
    });

    // IF ROLE FOUND IN DB
    if (getRole && getRole.role) {
      userRole = getRole.role;
    }
  }

  // CHECK PERMISSIONS
  if (roles) {
    if (Array.isArray(roles)) {
      if (!roles.includes(userRole)) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You does not have permission to access this route!'));
      }
    } else if (typeof roles === 'string') {
      if (userRole !== roles) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You does not have permission to access this route!'));
      }
    }
  }

  resolve();
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
