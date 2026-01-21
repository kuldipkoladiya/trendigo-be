import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { StoreAddress, Store } from 'models';

export async function getStoreAddressById(id, options = {}) {
  const storeAddress = await StoreAddress.findById(id, options.projection, options);
  return storeAddress;
}

export async function getOne(query, options = {}) {
  const storeAddress = await StoreAddress.findOne(query, options.projection, options);
  return storeAddress;
}

export async function getStoreAddressList(filter, options = {}) {
  const storeAddress = await StoreAddress.find(filter, options.projection, options);
  return storeAddress;
}

export async function getStoreAddressListWithPagination(filter, options = {}) {
  const storeAddress = await StoreAddress.paginate(filter, options);
  return storeAddress;
}

export async function createStoreAddress(body = {}) {
  if (body.storeId) {
    const store = await Store.findById(body.storeId);
    if (!store) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field storeId is not valid');
    }

    // 1️⃣ create address
    const storeAddress = await StoreAddress.create(body);

    // 2️⃣ link address to store
    await Store.findByIdAndUpdate(
      body.storeId,
      {
        address: storeAddress._id,
      },
      { new: true }
    );

    return storeAddress;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'storeId is required');
}

export async function updateStoreAddress(filter, body, options = {}) {
  if (body.storeId) {
    const storeId = await Store.findOne({ _id: body.storeId });
    if (!storeId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field storeId is not valid');
    }
  }
  const storeAddress = await StoreAddress.findOneAndUpdate(filter, body, options);
  return storeAddress;
}

export async function updateManyStoreAddress(filter, body, options = {}) {
  const storeAddress = await StoreAddress.updateMany(filter, body, options);
  return storeAddress;
}

export async function removeStoreAddress(filter) {
  const storeAddress = await StoreAddress.findOneAndRemove(filter);
  return storeAddress;
}

export async function removeManyStoreAddress(filter) {
  const storeAddress = await StoreAddress.deleteMany(filter);
  return storeAddress;
}

export async function aggregateStoreAddress(query) {
  const storeAddress = await StoreAddress.aggregate(query);
  return storeAddress;
}

// export async function aggregateStoreAddressWithPagination(query, options = {}) {
//   const aggregate = StoreAddress.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const storeAddress = await StoreAddress.aggregatePaginate(aggregate, options);
//   return storeAddress;
// }
