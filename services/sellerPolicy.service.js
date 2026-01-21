import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { SellerPolicy, Store } from 'models';

export async function getSellerPolicyById(id, options = {}) {
  const sellerPolicy = await SellerPolicy.findById(id, options.projection, options);
  return sellerPolicy;
}

export async function getOne(query, options = {}) {
  const sellerPolicy = await SellerPolicy.findOne(query, options.projection, options);
  return sellerPolicy;
}

export async function getSellerPolicyList(filter, options = {}) {
  const sellerPolicy = await SellerPolicy.find(filter, options.projection, options);
  return sellerPolicy;
}

export async function getSellerPolicyListWithPagination(filter, options = {}) {
  const sellerPolicy = await SellerPolicy.paginate(filter, options);
  return sellerPolicy;
}

export async function createSellerPolicy(body = {}) {
  if (body.store) {
    const store = await Store.findOne({ _id: body.store });
    if (!store) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field store is not valid');
    }
  }
  const sellerPolicy = await SellerPolicy.create(body);
  return sellerPolicy;
}

export async function updateSellerPolicy(filter, body, options = {}) {
  if (body.store) {
    const store = await Store.findOne({ _id: body.store });
    if (!store) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field store is not valid');
    }
  }
  const sellerPolicy = await SellerPolicy.findOneAndUpdate(filter, body, options);
  return sellerPolicy;
}

export async function updateManySellerPolicy(filter, body, options = {}) {
  const sellerPolicy = await SellerPolicy.updateMany(filter, body, options);
  return sellerPolicy;
}

export async function removeSellerPolicy(filter) {
  const sellerPolicy = await SellerPolicy.findOneAndRemove(filter);
  return sellerPolicy;
}

export async function removeManySellerPolicy(filter) {
  const sellerPolicy = await SellerPolicy.deleteMany(filter);
  return sellerPolicy;
}

export async function aggregateSellerPolicy(query) {
  const sellerPolicy = await SellerPolicy.aggregate(query);
  return sellerPolicy;
}

// export async function aggregateSellerPolicyWithPagination(query, options = {}) {
//   const aggregate = SellerPolicy.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const sellerPolicy = await SellerPolicy.aggregatePaginate(aggregate, options);
//   return sellerPolicy;
// }
