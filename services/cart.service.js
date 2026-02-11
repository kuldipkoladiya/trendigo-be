import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Cart, Product, ProductVarientByProductId, UserAddress } from 'models';

export async function getCartById(id, options = {}) {
  const cart = await Cart.findById(id, options.projection, options);
  return cart;
}

export async function getOne(query, options = {}) {
  const cart = await Cart.findOne(query, options.projection, options);
  return cart;
}

export async function getCartList(filter, options = {}) {
  const cart = await Cart.find(filter, options.projection, options);
  return cart;
}

export async function getCartListWithPagination(filter, options = {}) {
  const cart = await Cart.paginate(filter, options);
  return cart;
}

export async function createCart(body = {}) {
  if (body.productDetailList && body.productDetailList.productId) {
    const productId = await Product.findOne({ _id: body.productDetailList.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'productId not found!');
    }
  }
  if (body.productDetailList && body.productDetailList.variants) {
    const variants = await ProductVarientByProductId.findOne({
      _id: body.productDetailList.variants,
    });
    if (!variants) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'variants not found!');
    }
  }
  if (body.deliveryAddress) {
    const deliveryAddress = await UserAddress.findOne({ _id: body.deliveryAddress });
    if (!deliveryAddress) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field deliveryAddress is not valid');
    }
  }
  const cart = await Cart.create(body);
  return cart;
}

export async function updateCart(filter, body, options = {}) {
  if (body.productDetailList && body.productDetailList.productId) {
    const productId = await Product.findOne({ _id: body.productDetailList.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'productId not found!');
    }
  }
  if (body.productDetailList && body.productDetailList.variants) {
    const variants = await ProductVarientByProductId.findOne({
      _id: body.productDetailList.variants,
    });
    if (!variants) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'variants not found!');
    }
  }
  if (body.deliveryAddress) {
    const deliveryAddress = await UserAddress.findOne({ _id: body.deliveryAddress });
    if (!deliveryAddress) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field deliveryAddress is not valid');
    }
  }
  const cart = await Cart.findOneAndUpdate(filter, body, options);
  return cart;
}

export async function updateManyCart(filter, body, options = {}) {
  const cart = await Cart.updateMany(filter, body, options);
  return cart;
}

export async function removeCart(filter) {
  const cart = await Cart.findOneAndRemove(filter);
  return cart;
}

export async function removeManyCart(filter) {
  const cart = await Cart.deleteMany(filter);
  return cart;
}

export async function aggregateCart(query) {
  const cart = await Cart.aggregate(query);
  return cart;
}

// export async function aggregateCartWithPagination(query, options = {}) {
//   const aggregate = Cart.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const cart = await Cart.aggregatePaginate(aggregate, options);
//   return cart;
// }
