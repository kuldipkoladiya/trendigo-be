/* eslint-disable no-param-reassign, no-console */
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { userService, sellerUserService } from 'services';
import ApiError from 'utils/ApiError';
import config from 'config/config';

module.exports = {
  async initSubscription(socket, next) {
    try {
      const { token } = socket.handshake.query;
      if (!token) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate: No token provided'));
      }

      const decoded = jwt.verify(token, config.jwt.secret, { ignoreExpiration: false });
      if (!decoded || !decoded.sub) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate: Bad token format', true));
      }

      const user = await userService.getUserById(decoded.sub);
      if (user) {
        await user.populate('role');
        const roleName = user.role && user.role.role;
        const isAdmin = ['admin', 'super-admin', 'co-admin'].includes(roleName);
        socket.user = { _id: user._id };
        socket.userModel = isAdmin ? 'Admin' : 'User';
        socket.startedAt = new Date();
        socket.join(user._id.toString());
        socket.on('disconnect', function () {});
        return next();
      }

      const seller = await sellerUserService.getSellerUserById(decoded.sub);
      if (seller) {
        socket.user = { _id: seller._id };
        socket.userModel = 'SellerUser';
        socket.startedAt = new Date();
        socket.join(seller._id.toString());
        socket.on('disconnect', function () {});
        return next();
      }

      console.error(`[Socket Auth] No User or Seller found for ID: ${decoded.sub}`);
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate: Account not found'));
    } catch (err) {
      console.error('[Socket Auth] Error:', err.message);
      return next(new ApiError(httpStatus.UNAUTHORIZED, `Please authenticate: ${err.message}`));
    }
  },
};
