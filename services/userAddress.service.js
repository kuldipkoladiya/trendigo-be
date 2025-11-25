import { UserAddress } from 'models';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

export async function getUserAddressById(id, options = {}) {
  const userAddress = await UserAddress.findById(id, options.projection, options);
  return userAddress;
}

export async function getOne(query, options = {}) {
  const userAddress = await UserAddress.findOne(query, options.projection, options);
  return userAddress;
}

export async function getUserAddressList(filter, options = {}) {
  const userAddress = await UserAddress.find(filter, options.projection, options);
  return userAddress;
}

export async function getUserAddressListWithPagination(filter, options = {}) {
  const userAddress = await UserAddress.paginate(filter, options);
  return userAddress;
}

export async function createUserAddress(body = {}) {
  // If user sets this address as default
  if (body.isDefaultAddress === true) {
    await UserAddress.updateMany({ userId: body.userId }, { $set: { isDefaultAddress: false } });
  }
  const userAddress = await UserAddress.create(body);
  return userAddress;
}

export async function updateUserAddress(filter, body = {}) {
  // 1️⃣ Find the address you want to update
  const existingAddress = await UserAddress.findOne(filter);
  if (!existingAddress) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }

  // 2️⃣ If user sets this address as default = true
  if (body.isDefaultAddress === true) {
    await UserAddress.updateMany({ userId: existingAddress.userId }, { $set: { isDefaultAddress: false } });
  }

  // 3️⃣ Update the target address
  const updatedAddress = await UserAddress.findOneAndUpdate(
    filter,
    body,
    { new: true } // always return updated document
  );

  return updatedAddress;
}

export async function updateManyUserAddress(filter, body, options = {}) {
  const userAddress = await UserAddress.updateMany(filter, body, options);
  return userAddress;
}

export async function removeUserAddress(filter) {
  const userAddress = await UserAddress.findOneAndRemove(filter);
  return userAddress;
}

export async function removeManyUserAddress(filter) {
  const userAddress = await UserAddress.deleteMany(filter);
  return userAddress;
}

export async function aggregateUserAddress(query) {
  const userAddress = await UserAddress.aggregate(query);
  return userAddress;
}

// export async function aggregateUserAddressWithPagination(query, options = {}) {
//   const aggregate = UserAddress.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const userAddress = await UserAddress.aggregatePaginate(aggregate, options);
//   return userAddress;
// }
