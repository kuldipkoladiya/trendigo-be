import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { ProductVarientByProductId, Product } from 'models';

export async function getProductVarientByProductIdById(id, options = {}) {
  const productVarientByProductId = await ProductVarientByProductId.findById(id, options.projection, options);
  return productVarientByProductId;
}

export async function getOne(query, options = {}) {
  const productVarientByProductId = await ProductVarientByProductId.findOne(query, options.projection, options);
  return productVarientByProductId;
}

export async function getProductVarientByProductIdList(filter, options = {}) {
  const productVarientByProductId = await ProductVarientByProductId.find(filter, options.projection, options);
  return productVarientByProductId;
}

export async function getProductVarientByProductIdListWithPagination(filter, options = {}) {
  const productVarientByProductId = await ProductVarientByProductId.paginate(filter, options);
  return productVarientByProductId;
}

export async function createProductVarientByProductId(body = {}) {
  if (body.productId) {
    const productId = await Product.findOne({ _id: body.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productId is not valid');
    }
  }
  const productVarientByProductId = await ProductVarientByProductId.create(body);
  return productVarientByProductId;
}

export async function updateProductVarientByProductId(filter, body, options = {}) {
  if (body.productId) {
    const productId = await Product.findOne({ _id: body.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productId is not valid');
    }
  }
  const productVarientByProductId = await ProductVarientByProductId.findOneAndUpdate(filter, body, options);
  return productVarientByProductId;
}

export async function updateManyProductVarientByProductId(filter, body, options = {}) {
  const productVarientByProductId = await ProductVarientByProductId.updateMany(filter, body, options);
  return productVarientByProductId;
}

export async function removeProductVarientByProductId(filter) {
  const productVarientByProductId = await ProductVarientByProductId.findOneAndRemove(filter);
  return productVarientByProductId;
}

export async function removeManyProductVarientByProductId(filter) {
  const productVarientByProductId = await ProductVarientByProductId.deleteMany(filter);
  return productVarientByProductId;
}

export async function aggregateProductVarientByProductId(query) {
  const productVarientByProductId = await ProductVarientByProductId.aggregate(query);
  return productVarientByProductId;
}

// export async function aggregateProductVarientByProductIdWithPagination(query, options = {}) {
//   const aggregate = ProductVarientByProductId.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const productVarientByProductId = await ProductVarientByProductId.aggregatePaginate(aggregate, options);
//   return productVarientByProductId;
// }
