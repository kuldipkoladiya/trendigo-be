import httpStatus from 'http-status';
import ApiError from 'utils/ApiError';

/**
 * Middleware to check seller sub-user permissions.
 * @param {string} resource - The resource name (e.g., 'products', 'orders', 'inventory', 'reviews', 'storeSettings')
 * @param {string} action - The action type (e.g., 'view', 'add', 'update', 'delete')
 */
const checkSellerPermission = (resource, action) => async (req, res, next) => {
  try {
    const { user } = req;

    // If the authenticated user is the main seller (no role ObjectId assigned), grant full access
    if (!user.role) {
      return next();
    }

    // Check embedded permissions in req.user (attached by passport strategy)
    const { permissions } = user;
    if (!permissions || !permissions[resource] || !permissions[resource][action]) {
      throw new ApiError(httpStatus.FORBIDDEN, `Access denied: You do not have permission to ${action} ${resource}.`);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkSellerPermission;
