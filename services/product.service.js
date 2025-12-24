import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Product, Store, ProductCategories, ProductBrand, ProductVarientByProductId } from 'models';

export async function getProductById(id, options = {}) {
  const product = await Product.findById(id, options.projection, options);
  return product;
}

export async function getOne(filter, options = {}) {
  return Product.findOne(filter, options.projection, options)
    .populate({ path: 'storeId', select: 'name storeUrl profileImage' })
    .populate({ path: 'sellerId', select: 'name email' })
    .populate({ path: 'productTypeId', select: 'value' })
    .populate({ path: 'brandId', select: 'name logo' })
    .populate({ path: 'productCategoryId', select: 'value parentCategoryId' })
    .populate({
      path: 'variants',
      match: { isDeleted: false }, // because you use softDelete
      select: `
        variantKey
        variantValue
        quantity
        price
        discount
        sku
        image
      `,
      populate: {
        path: 'image',
        select: 'url', // adjust based on S3image schema
      },
    });
}

export async function getProductList(filter, options = {}) {
  const product = await Product.find(filter, options.projection, options);
  return product;
}

export async function getProductListWithPagination(filter, options = {}) {
  const product = await Product.paginate(filter, options);
  return product;
}

export async function createProduct(body = {}) {
  if (body.storeId) {
    const storeId = await Store.findOne({ _id: body.storeId });
    if (!storeId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field storeId is not valid');
    }
  }
  if (body.productCategoyId) {
    const productCategoyId = await ProductCategories.findOne({ _id: body.productCategoyId });
    if (!productCategoyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productCategoyId is not valid');
    }
  }
  if (body.brandId) {
    const brandId = await ProductBrand.findOne({ _id: body.brandId });
    if (!brandId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field brandId is not valid');
    }
  }
  if (body.variants) {
    const variants = await ProductVarientByProductId.find({ _id: { $in: body.variants } });
    if (variants.length !== body.variants.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field variants is not valid');
    }
  }
  const product = await Product.create(body);
  return product;
}

export async function updateProduct(filter, body, options = {}) {
  if (body.storeId) {
    const storeId = await Store.findOne({ _id: body.storeId });
    if (!storeId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field storeId is not valid');
    }
  }
  if (body.productCategoyId) {
    const productCategoyId = await ProductCategories.findOne({ _id: body.productCategoyId });
    if (!productCategoyId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productCategoyId is not valid');
    }
  }
  if (body.brandId) {
    const brandId = await ProductBrand.findOne({ _id: body.brandId });
    if (!brandId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field brandId is not valid');
    }
  }
  if (body.variants) {
    const variants = await ProductVarientByProductId.find({ _id: { $in: body.variants } });
    if (variants.length !== body.variants.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field variants is not valid');
    }
  }
  const product = await Product.findOneAndUpdate(filter, body, options);
  return product;
}

export async function updateManyProduct(filter, body, options = {}) {
  const product = await Product.updateMany(filter, body, options);
  return product;
}

export async function removeProduct(filter) {
  const product = await Product.findOneAndRemove(filter);
  return product;
}

export async function removeManyProduct(filter) {
  const product = await Product.deleteMany(filter);
  return product;
}

export async function aggregateProduct(query) {
  const product = await Product.aggregate(query);
  return product;
}

// export async function aggregateProductWithPagination(query, options = {}) {
//   const aggregate = Product.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const product = await Product.aggregatePaginate(aggregate, options);
//   return product;
// }
