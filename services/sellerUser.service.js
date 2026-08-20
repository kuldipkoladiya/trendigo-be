import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { SellerUser } from 'models';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger';
import { notificationService } from './index';
import { updateUser } from './user.service';

export async function getSellerUserById(id, options = {}) {
  const sellerUser = await SellerUser.findById(id, options.projection, options).populate('storeId').populate('role').exec();
  return sellerUser;
}

export async function getOne(query, options = {}) {
  const sellerUser = await SellerUser.findOne(query, options.projection, options);
  return sellerUser;
}

export async function getSellerUserList(filter, options = {}) {
  const sellerUser = await SellerUser.find(filter, options.projection, options);
  return sellerUser;
}

export async function getSellerUserListWithPagination(filter, options = {}) {
  const sellerUser = await SellerUser.paginate(filter, options);
  return sellerUser;
}

export async function createSellerUser(body = {}) {
  try {
    const sellerUser = await SellerUser.create(body);
    return sellerUser;
  } catch (error) {
    logger.error('error in creating sellerUser:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateSellerUser(filter, body, options = {}) {
  try {
    const sellerUser = await SellerUser.findOneAndUpdate(filter, body, options);
    return sellerUser;
  } catch (error) {
    logger.error('error in creating sellerUser:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function updateManySellerUser(filter, body, options = {}) {
  try {
    const sellerUser = await SellerUser.updateMany(filter, body, options);
    return sellerUser;
  } catch (error) {
    logger.error('error in creating sellerUser:', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are trying to create duplicate entry!');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
}

export async function removeSellerUser(filter) {
  const sellerUser = await SellerUser.findOneAndRemove(filter);
  return sellerUser;
}

export async function removeManySellerUser(filter) {
  const sellerUser = await SellerUser.deleteMany(filter);
  return sellerUser;
}

export async function aggregateSellerUser(query) {
  const sellerUser = await SellerUser.aggregate(query);
  return sellerUser;
}

// export async function aggregateSellerUserWithPagination(query, options = {}) {
//   const aggregate = SellerUser.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const sellerUser = await SellerUser.aggregatePaginate(aggregate, options);
//   return sellerUser;
// }

export async function addDeviceToken(user, body = {}, throwOnError = false) {
  const { deviceToken, platform } = body;
  if (!deviceToken || typeof deviceToken !== 'string' || !deviceToken.trim()) {
    return user;
  }

  const isFCMValid = await notificationService.verifyFCMToken(deviceToken);
  if (!isFCMValid) {
    if (throwOnError) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The FCM Token is invalid!');
    }
    console.warn(`⚠️ [FCM Warning] Invalid or unverified seller deviceToken skipped: ${deviceToken}`);
    return user;
  }

  const deviceTokenList = (user.deviceTokens || []).map((data) => (typeof data === 'string' ? data : data.deviceToken));
  if (_.indexOf(deviceTokenList, deviceToken) === -1) {
    const tokenObj = { deviceToken, ...(platform && { platform }) };
    user.deviceTokens.push(tokenObj);
    const updatedUser = await updateUser({ _id: user._id }, { $addToSet: { deviceTokens: tokenObj } }, { new: true });
    return updatedUser;
  }
  return user;
}

export async function updatesellerUserForAuth(filter, body, options = {}, user) {
  // --- Check email uniqueness ---
  if (body.email && (await SellerUser.findOne({ email: body.email, _id: { $ne: user._id } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // --- Hash password if provided ---
  if (body && body.password) {
    // eslint-disable-next-line no-param-reassign
    body.password = await bcrypt.hash(body.password, 10);
  }
  // --- Update user ---
  await SellerUser.updateOne(filter, body, options);
  return getOne(filter);
}
