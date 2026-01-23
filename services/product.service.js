import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Product, Store, ProductCategories, ProductBrand, ProductVarientByProductId } from 'models';
import mongoose from 'mongoose';

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
      match: { isDeleted: false },
      select: `
        variants
        quantity
        price
        discount
        sku
        image
      `,
      populate: {
        path: 'images videos',
        select: 'imageUrl imageName isSelectedForMainScreen',
      },
    });
}

export async function getProductList(filter = {}) {
  return Product.find(filter)
    .populate({
      path: 'storeId',
      select: 'name storeUrl profileImage',
    })
    .populate({
      path: 'sellerId',
      select: 'name email',
    })
    .populate({
      path: 'productTypeId',
      select: 'value',
    })
    .populate({
      path: 'brandId',
      select: 'name logo',
    })
    .populate({
      path: 'productCategoryId',
      select: 'value parentCategoryId',
    })
    .populate({
      path: 'variants',
      match: { isDeleted: false },
      populate: {
        path: 'images videos',
        select: 'imageUrl imageName isSelectedForMainScreen',
      },
    });
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

export async function getProductListPaginated(filter, options) {
  return Product.paginate(filter, {
    ...options,
    lean: true,
    populate: [
      { path: 'storeId', select: 'name storeUrl profileImage' },
      { path: 'sellerId', select: 'name email' },
      { path: 'productTypeId', select: 'value' },
      { path: 'brandId', select: 'name logo' },
      { path: 'productCategoryId', select: 'value parentCategoryId' },
      {
        path: 'variants',
        populate: {
          path: 'images videos',
          select: 'imageUrl imageName isSelectedForMainScreen',
        },
      },
    ],
  });
}

export async function getProductListByReviewWithPagination(page = 1, limit = 10, userId = null) {
  const skip = (page - 1) * limit;

  const pipeline = [
    // ======================================================
    // REVIEWS
    // ======================================================
    {
      $lookup: {
        from: 'Review',
        localField: '_id',
        foreignField: 'productId',
        as: 'reviews',
        pipeline: [
          {
            $match: {
              isAdminAprove: true,
              isDeleted: { $ne: true },
            },
          },
        ],
      },
    },

    {
      $addFields: {
        averageRating: {
          $ifNull: [{ $avg: '$reviews.rating' }, 0],
        },
        totalReviews: { $size: '$reviews' },
      },
    },
    {
      $unset: 'reviews',
    },
    { $sort: { averageRating: -1, totalReviews: -1 } },

    // ======================================================
    // PAGINATION + DATA
    // ======================================================
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },

          // ==================================================
          // WISHLIST (BULLETPROOF)
          // ==================================================
          ...(userId
            ? [
                {
                  $lookup: {
                    from: 'UserWishlist',
                    let: { productId: '$_id' },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              {
                                $eq: [{ $toString: '$productId' }, { $toString: '$$productId' }],
                              },
                              {
                                $eq: [{ $toString: '$userId' }, userId.toString()],
                              },
                              { $ne: ['$isDeleted', true] },
                            ],
                          },
                        },
                      },
                    ],
                    as: 'wishlistData',
                  },
                },
                {
                  $addFields: {
                    isWishlisted: {
                      $gt: [{ $size: '$wishlistData' }, 0],
                    },
                  },
                },
              ]
            : [
                {
                  $addFields: {
                    isWishlisted: false,
                  },
                },
              ]),

          // ==================================================
          // PRODUCT TYPE
          // ==================================================
          {
            $lookup: {
              from: 'ProductType',
              localField: 'productTypeId',
              foreignField: '_id',
              as: 'productTypeId',
            },
          },
          {
            $unwind: {
              path: '$productTypeId',
              preserveNullAndEmptyArrays: true,
            },
          },

          // ==================================================
          // BRAND
          // ==================================================
          {
            $lookup: {
              from: 'ProductBrand',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brandId',
            },
          },
          {
            $unwind: {
              path: '$brandId',
              preserveNullAndEmptyArrays: true,
            },
          },

          // ==================================================
          // CATEGORY
          // ==================================================
          {
            $lookup: {
              from: 'ProductCategories',
              localField: 'productCategoryId',
              foreignField: '_id',
              as: 'productCategoryId',
            },
          },
          {
            $unwind: {
              path: '$productCategoryId',
              preserveNullAndEmptyArrays: true,
            },
          },

          // ==================================================
          // VARIANTS + MEDIA
          // ==================================================
          {
            $lookup: {
              from: 'ProductVarientByProductId',
              localField: 'variants',
              foreignField: '_id',
              as: 'variants',
              pipeline: [
                { $match: { isDeleted: { $ne: true } } },
                {
                  $lookup: {
                    from: 'S3image',
                    localField: 'images',
                    foreignField: '_id',
                    as: 'images',
                  },
                },
                {
                  $lookup: {
                    from: 'S3image',
                    localField: 'videos',
                    foreignField: '_id',
                    as: 'videos',
                  },
                },
              ],
            },
          },
        ],

        // ==================================================
        // TOTAL COUNT
        // ==================================================
        metaData: [{ $count: 'total' }],
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  const data = result && result.length && result[0].data ? result[0].data : [];

  const total = result && result.length && result[0].metaData && result[0].metaData.length ? result[0].metaData[0].total : 0;

  return {
    results: data,
    page,
    limit,
    totalResults: total,
    totalPages: Math.ceil(total / limit),
  };
}
export async function getProductDetailsById(productId, userId = null) {
  const pipeline = [
    // ------------------------------------------------
    // MATCH PRODUCT
    // ------------------------------------------------
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
        isDeleted: { $ne: true },
      },
    },

    // ------------------------------------------------
    // REVIEWS
    // ------------------------------------------------
    {
      $lookup: {
        from: 'Review',
        localField: '_id',
        foreignField: 'productId',
        as: 'reviews',
        pipeline: [
          {
            $match: {
              isAdminAprove: true,
              isDeleted: { $ne: true },
            },
          },
        ],
      },
    },

    {
      $addFields: {
        averageRating: {
          $ifNull: [{ $avg: '$reviews.rating' }, 0],
        },
        totalReviews: { $size: '$reviews' },
      },
    },

    // ------------------------------------------------
    // WISHLIST (OPTIONAL)
    // ------------------------------------------------
    ...(userId
      ? [
          {
            $lookup: {
              from: 'UserWishlist',
              let: { productId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [{ $toString: '$productId' }, { $toString: '$$productId' }],
                        },
                        {
                          $eq: [{ $toString: '$userId' }, userId.toString()],
                        },
                        { $ne: ['$isDeleted', true] },
                      ],
                    },
                  },
                },
              ],
              as: 'wishlistData',
            },
          },
          {
            $addFields: {
              isWishlisted: {
                $gt: [{ $size: '$wishlistData' }, 0],
              },
            },
          },
        ]
      : [
          {
            $addFields: {
              isWishlisted: false,
            },
          },
        ]),

    // ------------------------------------------------
    // STORE
    // ------------------------------------------------
    {
      $lookup: {
        from: 'Store',
        localField: 'storeId',
        foreignField: '_id',
        as: 'storeId',
      },
    },
    { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },

    // ------------------------------------------------
    // SELLER
    // ------------------------------------------------
    {
      $lookup: {
        from: 'SellerUser',
        localField: 'sellerId',
        foreignField: '_id',
        as: 'sellerId',
      },
    },
    { $unwind: { path: '$sellerId', preserveNullAndEmptyArrays: true } },

    // ------------------------------------------------
    // PRODUCT TYPE
    // ------------------------------------------------
    {
      $lookup: {
        from: 'ProductType',
        localField: 'productTypeId',
        foreignField: '_id',
        as: 'productTypeId',
      },
    },
    { $unwind: { path: '$productTypeId', preserveNullAndEmptyArrays: true } },

    // ------------------------------------------------
    // BRAND
    // ------------------------------------------------
    {
      $lookup: {
        from: 'ProductBrand',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brandId',
      },
    },
    { $unwind: { path: '$brandId', preserveNullAndEmptyArrays: true } },

    // ------------------------------------------------
    // CATEGORY
    // ------------------------------------------------
    {
      $lookup: {
        from: 'ProductCategories',
        localField: 'productCategoryId',
        foreignField: '_id',
        as: 'productCategoryId',
      },
    },
    { $unwind: { path: '$productCategoryId', preserveNullAndEmptyArrays: true } },

    // ------------------------------------------------
    // VARIANTS
    // ------------------------------------------------
    {
      $lookup: {
        from: 'ProductVarientByProductId',
        localField: 'variants',
        foreignField: '_id',
        as: 'variants',
        pipeline: [
          { $match: { isDeleted: { $ne: true } } },
          {
            $lookup: {
              from: 'S3image',
              localField: 'images',
              foreignField: '_id',
              as: 'images',
            },
          },
          {
            $lookup: {
              from: 'S3image',
              localField: 'videos',
              foreignField: '_id',
              as: 'videos',
            },
          },
        ],
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  return result[0] || null;
}
