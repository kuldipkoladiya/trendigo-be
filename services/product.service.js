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

export async function getStoreProductListWithReviews(storeId, page = 1, limit = 12, userId = null) {
  const skip = (page - 1) * limit;

  const storeObjectId = new mongoose.Types.ObjectId(storeId);
  const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null;

  const pipeline = [
    // =================================================
    // FILTER STORE
    // =================================================
    {
      $match: {
        storeId: storeObjectId,
        isDeleted: { $ne: true },
      },
    },

    // =================================================
    // SORT LATEST FIRST
    // =================================================
    {
      $sort: { createdAt: -1 },
    },

    // =================================================
    // REVIEWS
    // =================================================
    {
      $lookup: {
        from: 'Review',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [
          {
            $match: {
              isAdminAprove: true,
              isDeleted: { $ne: true },
            },
          },
        ],
        as: 'reviews',
      },
    },

    // ⭐ ROUND RATING HERE
    {
      $addFields: {
        averageRating: {
          $round: [
            { $ifNull: [{ $avg: '$reviews.rating' }, 0] },
            1, // change to 0 if you want integer stars
          ],
        },
        totalReviews: { $size: '$reviews' },
      },
    },

    {
      $unset: 'reviews',
    },

    // =================================================
    // FACET (DATA + STORE META)
    // =================================================
    {
      $facet: {
        // ================= DATA =================
        data: [
          { $skip: skip },
          { $limit: limit },

          // =================================================
          // WISHLIST
          // =================================================
          ...(userObjectId
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
                              { $eq: ['$productId', '$$productId'] },
                              { $eq: ['$userId', userObjectId] },
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
                { $unset: 'wishlistData' },
              ]
            : [
                {
                  $addFields: {
                    isWishlisted: false,
                  },
                },
              ]),

          // =================================================
          // STORE
          // =================================================
          {
            $lookup: {
              from: 'Store',
              localField: 'storeId',
              foreignField: '_id',
              as: 'storeId',
            },
          },
          {
            $unwind: {
              path: '$storeId',
              preserveNullAndEmptyArrays: true,
            },
          },

          // =================================================
          // SELLER
          // =================================================
          {
            $lookup: {
              from: 'User',
              localField: 'sellerId',
              foreignField: '_id',
              as: 'sellerId',
            },
          },
          {
            $unwind: {
              path: '$sellerId',
              preserveNullAndEmptyArrays: true,
            },
          },

          // =================================================
          // PRODUCT TYPE
          // =================================================
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

          // =================================================
          // BRAND
          // =================================================
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

          // =================================================
          // CATEGORY
          // =================================================
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

          // =================================================
          // VARIANTS + MEDIA
          // =================================================
          {
            $lookup: {
              from: 'ProductVarientByProductId',
              localField: 'variants',
              foreignField: '_id',
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
              as: 'variants',
            },
          },
        ],

        // ================= META =================
        metaData: [
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              averageStoreRating: { $avg: '$averageRating' },
            },
          },
          {
            $project: {
              _id: 0,
              totalProducts: 1,
              averageStoreRating: {
                $round: ['$averageStoreRating', 1],
              },
            },
          },
        ],
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  const data = result && result[0] && result[0].data ? result[0].data : [];
  const meta = result && result[0] && result[0].metaData && result[0].metaData[0] ? result[0].metaData[0] : {};

  const total = meta.totalProducts ? meta.totalProducts : 0;
  const storeAverageRating = meta.averageStoreRating ? meta.averageStoreRating : 0;

  return {
    results: data,
    page,
    limit,
    totalResults: total,
    totalPages: Math.ceil(total / limit),
    storeAverageRating,
  };
}

export async function searchProducts(params, userId = null) {
  const {
    keyword = '',
    categoryId,
    brandId,
    storeId,
    sellerId,
    productTypeId,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
  } = params;

  // ✅ prefer-const fix
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const skip = (page - 1) * limit;

  const match = {
    isDeleted: { $ne: true },
  };

  if (categoryId) match.productCategoryId = new mongoose.Types.ObjectId(categoryId);
  if (brandId) match.brandId = new mongoose.Types.ObjectId(brandId);
  if (storeId) match.storeId = new mongoose.Types.ObjectId(storeId);
  if (sellerId) match.sellerId = new mongoose.Types.ObjectId(sellerId);
  if (productTypeId) match.productTypeId = new mongoose.Types.ObjectId(productTypeId);

  if (minPrice || maxPrice) {
    match.sellingPrice = {};
    if (minPrice) match.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) match.sellingPrice.$lte = Number(maxPrice);
  }

  const pipeline = [
    { $match: match },

    // PRODUCT TYPE LOOKUP
    {
      $lookup: {
        from: 'ProductType',
        localField: 'productTypeId',
        foreignField: '_id',
        as: 'productType',
      },
    },
    {
      $unwind: {
        path: '$productType',
        preserveNullAndEmptyArrays: true,
      },
    },

    // CATEGORY LOOKUP
    {
      $lookup: {
        from: 'ProductCategories',
        localField: 'productCategoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },

    // BRAND LOOKUP
    {
      $lookup: {
        from: 'ProductBrand',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand',
      },
    },
    {
      $unwind: {
        path: '$brand',
        preserveNullAndEmptyArrays: true,
      },
    },

    // STORE LOOKUP
    {
      $lookup: {
        from: 'Store',
        localField: 'storeId',
        foreignField: '_id',
        as: 'store',
      },
    },
    {
      $unwind: {
        path: '$store',
        preserveNullAndEmptyArrays: true,
      },
    },

    // SELLER LOOKUP
    {
      $lookup: {
        from: 'SellerUser',
        localField: 'sellerId',
        foreignField: '_id',
        as: 'seller',
      },
    },
    {
      $unwind: {
        path: '$seller',
        preserveNullAndEmptyArrays: true,
      },
    },

    // REVIEW LOOKUP
    {
      $lookup: {
        from: 'Review',
        localField: '_id',
        foreignField: 'productId',
        as: 'reviews',
      },
    },

    // REVIEW STATS
    {
      $addFields: {
        reviewCount: { $size: '$reviews' },
        averageRating: {
          $cond: [{ $gt: [{ $size: '$reviews' }, 0] }, { $avg: '$reviews.rating' }, 0],
        },
      },
    },

    // WISHLIST LOOKUP
    ...(userId
      ? [
          {
            $lookup: {
              from: 'Wishlist',
              let: { productId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$productId', '$$productId'] },
                        {
                          $eq: ['$userId', new mongoose.Types.ObjectId(userId)],
                        },
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

    // VARIANT LOOKUP
    {
      $lookup: {
        from: 'ProductVarientByProductId',
        localField: '_id',
        foreignField: 'productId',
        as: 'variants',
      },
    },

    // FINAL PRICE
    {
      $addFields: {
        finalPrice: {
          $cond: ['$variantsEnabled', { $min: '$variants.price' }, '$sellingPrice'],
        },
      },
    },
  ];

  // KEYWORD SEARCH
  if (keyword) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { 'category.value': { $regex: keyword, $options: 'i' } },
          { 'brand.name': { $regex: keyword, $options: 'i' } },
          { 'store.name': { $regex: keyword, $options: 'i' } },
          { 'seller.businessName': { $regex: keyword, $options: 'i' } },
          { 'productType.value': { $regex: keyword, $options: 'i' } },
        ],
      },
    });
  }

  // SORT
  let sort = { createdAt: -1 };

  if (sortBy === 'priceLow') sort = { finalPrice: 1 };
  if (sortBy === 'priceHigh') sort = { finalPrice: -1 };

  pipeline.push({ $sort: sort });

  // PAGINATION
  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: 'count' }],
    },
  });

  const result = await Product.aggregate(pipeline);

  // SAFE EXTRACTION
  const first = result && result.length ? result[0] : null;

  const totalCount = first && first.totalCount && first.totalCount.length ? first.totalCount[0].count : 0;

  const resultsData = first && first.data ? first.data : [];

  return {
    results: resultsData,
    totalResults: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
    limit,
  };
}
