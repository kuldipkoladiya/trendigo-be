import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Product } from 'models';
import ProductVarientByProductId from '../models/productVarientByProductId.model';

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
  // 1️⃣ Validate productId
  const product = await Product.findById(body.productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'field productId is not valid');
  }

  // 2️⃣ Create variant
  const productVariant = await ProductVarientByProductId.create(body);

  // 3️⃣ Push variant ID into Product.variants[]
  await Product.findByIdAndUpdate(
    body.productId,
    {
      $addToSet: { variants: productVariant._id }, // prevents duplicates
      $set: { variantsEnabled: true },
    },
    { new: true }
  );

  return productVariant;
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
  // 1️⃣ Find variant
  const variant = await ProductVarientByProductId.findOne(filter);
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }

  // 2️⃣ Soft delete variant
  await ProductVarientByProductId.findByIdAndUpdate(variant._id, { isDeleted: true }, { new: true });

  // 3️⃣ Remove variant reference from Product
  await Product.findByIdAndUpdate(
    variant.productId,
    {
      $pull: { variants: variant._id },
    },
    { new: true }
  );

  // 4️⃣ Disable variants if none left
  const remainingVariants = await ProductVarientByProductId.countDocuments({
    productId: variant.productId,
    isDeleted: false,
  });

  if (remainingVariants === 0) {
    await Product.findByIdAndUpdate(variant.productId, {
      variantsEnabled: false,
    });
  }

  return true;
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

export async function getProductVarientColorList(filter) {
  const data = await ProductVarientByProductId.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(filter.productId),
        isDeleted: false,
      },
    },
    {
      $project: {
        id: '$_id',
        _id: 0,
        productId: 1,
        variants: {
          $filter: {
            input: '$variants',
            as: 'variant',
            cond: { $eq: ['$$variant.key', 'color'] },
          },
        },
      },
    },
  ]);

  return data;
}

export async function updateProductVarientById(id, body, user) {
  const updateQuery = {
    $set: {
      updatedBy: user._id,
    },
  };

  // ✅ normal fields → $set
  if (body.variants) updateQuery.$set.variants = body.variants;
  if (body.quantity !== undefined) updateQuery.$set.quantity = body.quantity;
  if (body.price !== undefined) updateQuery.$set.price = body.price;
  if (body.discount !== undefined) updateQuery.$set.discount = body.discount;
  if (body.sku) updateQuery.$set.sku = body.sku;

  // ✅ array fields → $addToSet
  if (Array.isArray(body.images) && body.images.length > 0) {
    updateQuery.$addToSet = {
      images: { $each: body.images },
    };
  }

  const updated = await ProductVarientByProductId.findByIdAndUpdate(id, updateQuery, { new: true });

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }

  return updated;
}
