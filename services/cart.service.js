import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Cart, Product, UserAddress } from 'models';
import ProductVarientByProductId from '../models/productVarientByProductId.model';

export async function getCartById(id, options = {}) {
  const cart = await Cart.findById(id, options.projection, options);
  return cart;
}

export async function getOne(query, options = {}) {
  const cart = await Cart.findOne(query, options.projection, options);
  return cart;
}

export async function getCartList(filter) {
  const cart = await Cart.findOne(filter)

    // 🔹 Populate selected product
    .populate({
      path: 'productDetailList.productId',
      populate: [
        {
          path: 'productCategoryId',
        },
        {
          path: 'productTypeId',
        },
      ],
    })

    // 🔹 Populate selected variant
    .populate({
      path: 'productDetailList.variants',
      populate: [
        {
          path: 'images',
        },
        {
          path: 'videos',
        },
      ],
    })

    // 🔹 Populate delivery address
    .populate({
      path: 'deliveryAddress',
    })

    // 🔹 Populate coupon
    .populate({
      path: 'storeDiscount',
    })
    .populate({
      path: 'userCoupanDiscount',
    })

    // 🔹 Populate user (optional)
    .populate({
      path: 'userId',
      select: 'name email mobileNumber',
    });

  return cart;
}

export async function getCartListWithPagination(filter, options = {}) {
  const cart = await Cart.paginate(filter, options);
  return cart;
}

export async function createCart(body = {}, userId) {
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (!Array.isArray(body.productDetailList) || body.productDetailList.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product details missing');
  }

  const { deliveryAddress, deliveryPartnerDetails } = body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      productDetailList: [],
      deliveryAddress,
      deliveryPartnerDetails,
      subTotal: 0,
      totalDiscount: 0,
      grandTotal: 0,
    });
  } else {
    cart.deliveryAddress = deliveryAddress || cart.deliveryAddress;
    cart.deliveryPartnerDetails = deliveryPartnerDetails || cart.deliveryPartnerDetails;
  }

  // Validate all products & variants
  await Promise.all(
    body.productDetailList.map(async (item) => {
      const { productId, variants, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found');
      }

      const variant = await ProductVarientByProductId.findById(variants);
      if (!variant) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Variant not found');
      }

      if (variant.productId.toString() !== productId.toString()) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Variant does not belong to this product');
      }

      if (variant.quantity < quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Only ${variant.quantity} items available in stock`);
      }

      const existingItemIndex = cart.productDetailList.findIndex(
        (cartItem) => cartItem.variants.toString() === variants.toString()
      );

      if (existingItemIndex > -1) {
        cart.productDetailList[existingItemIndex].quantity += quantity;
      } else {
        cart.productDetailList.push({
          productId,
          variants,
          quantity,
        });
      }
    })
  );

  // Get all variants once
  const variantIds = cart.productDetailList.map((item) => item.variants);

  const variantsData = await ProductVarientByProductId.find({
    _id: { $in: variantIds },
  });

  let subTotal = 0;
  let totalDiscount = 0;

  cart.productDetailList.forEach((item) => {
    const variant = variantsData.find((v) => v._id.toString() === item.variants.toString());

    if (!variant) return;

    const price = Number(variant.price) || 0;
    const discountPercent = Number(variant.discount) || 0;

    const discountAmountPerUnit = (price * discountPercent) / 100;

    subTotal += price * item.quantity;
    totalDiscount += discountAmountPerUnit * item.quantity;
  });

  cart.subTotal = Number(subTotal.toFixed(2));
  cart.totalDiscount = Number(totalDiscount.toFixed(2));
  cart.grandTotal = Number((subTotal - totalDiscount).toFixed(2));

  await cart.save();

  return cart;
}
export async function updateCart(userId, body = {}) {
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const { variants, quantity, deliveryAddress } = body;

  if (!variants) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Variant id is required');
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  // Validate Variant
  const variant = await ProductVarientByProductId.findById(variants);
  if (!variant) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Variant not found');
  }

  const itemIndex = cart.productDetailList.findIndex((item) => item.variants.toString() === variants.toString());

  if (itemIndex === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item not found in cart');
  }

  // Update quantity
  if (quantity !== undefined) {
    if (quantity < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity cannot be negative');
    }

    if (quantity > variant.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Only ${variant.quantity} items available in stock`);
    }

    if (quantity === 0) {
      cart.productDetailList.splice(itemIndex, 1);
    } else {
      cart.productDetailList[itemIndex].quantity = quantity;
    }
  }

  // Update delivery address
  if (deliveryAddress) {
    const address = await UserAddress.findById(deliveryAddress);
    if (!address) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid delivery address');
    }
    cart.deliveryAddress = deliveryAddress;
  }

  // 🔥 Recalculate totals
  let subTotal = 0;
  let totalDiscount = 0;

  const variantIds = cart.productDetailList.map((item) => item.variants);

  const variantsData = await ProductVarientByProductId.find({
    _id: { $in: variantIds },
  });

  cart.productDetailList.forEach((item) => {
    const variantData = variantsData.find((v) => v._id.toString() === item.variants.toString());

    if (!variantData) return;

    const price = Number(variantData.price) || 0;
    const discountPercent = Number(variantData.discount) || 0;

    const discountAmountPerUnit = (price * discountPercent) / 100;

    subTotal += price * item.quantity;
    totalDiscount += discountAmountPerUnit * item.quantity;
  });

  cart.subTotal = Number(subTotal.toFixed(2));
  cart.totalDiscount = Number(totalDiscount.toFixed(2));
  cart.grandTotal = Number((subTotal - totalDiscount).toFixed(2));

  await cart.save();

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
