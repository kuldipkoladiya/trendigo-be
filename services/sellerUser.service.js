import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { SellerUser } from 'models';
import { logger } from '../config/logger';
import _ from "lodash";

export async function getSellerUserById(id, options = {}) {
  const sellerUser = await SellerUser.findById(id, options.projection, options);
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

export async function createSellerUser(body, options = {}) {
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

export async function aggregateSellerUserWithPagination(query, options = {}) {
  const aggregate = SellerUser.aggregate();
  query.map((obj) => {
    aggregate._pipeline.push(obj);
  });
  const sellerUser = await SellerUser.aggregatePaginate(aggregate, options);
  return sellerUser;
}

export async function addDeviceToken(user, body) {
  const { deviceToken, platform } = body;
  const isFCMValid = notificationService.verifyFCMToken(deviceToken);
  if (!isFCMValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The FCM Token is invalid!');
  }
  const deviceTokenList = user.deviceTokens.map((data) => data.deviceToken);
  if (_.indexOf(deviceTokenList, deviceToken) === -1) {
    user.deviceTokens.push({ deviceToken, platform });
    const updatedUser = await updateUser({ _id: user._id }, { $addToSet: { deviceTokens: { deviceToken } } }, { new: true });
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
  await SellerUser.updateOne(filter, body, options)
  return getOne(filter);
}