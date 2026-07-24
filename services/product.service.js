import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Product, Store, ProductCategories, ProductBrand, ProductVarientByProductId, User } from 'models';
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

export async function getProductListSummary(filter = {}) {
  const products = await Product.find(filter)
    .populate({
      path: 'productTypeId',
      select: 'value',
    })
    .populate({
      path: 'productCategoryId',
      select: 'value parentCategoryId',
    })
    .populate({
      path: 'images',
      select: 'imageUrl imageName isSelectedForMainScreen',
    })
    .populate({
      path: 'variants',
      match: { isDeleted: false },
      populate: {
        path: 'images',
        select: 'imageUrl imageName isSelectedForMainScreen',
      },
    });

  return products.map((product) => {
    const productObj = product.toJSON ? product.toJSON() : product;

    // Calculate total stock
    let totalStock = 0;
    if (productObj.variantsEnabled && productObj.variants) {
      totalStock = productObj.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    } else if (productObj.variants) {
      totalStock = productObj.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    }
    // Return ONLY the requested fields, keeping the original variants structure but clean of other fields
    return {
      id: productObj.id,
      _id: productObj._id,
      title: productObj.title,
      productCode: productObj.productCode,
      sku: productObj.sku,
      productCategoryId: productObj.productCategoryId,
      productTypeId: productObj.productTypeId,
      variantsEnabled: productObj.variantsEnabled,
      images: productObj.images || [],
      variants: (productObj.variants || []).map((v) => ({
        id: v.id,
        _id: v._id,
        productId: v.productId,
        quantity: v.quantity,
        price: v.price,
        sku: v.sku,
        images: v.images || [],
        variants: v.variants || [],
        isDeleted: v.isDeleted || false,
        deletedAt: v.deletedAt || null,
      })),
      totalStock,
      price:
        productObj.variantsEnabled && productObj.variants && productObj.variants.length > 0
          ? productObj.variants[0].price
          : productObj.sellingPrice,
      status: productObj.isDeleted ? 'Inactive' : 'Active',
    };
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
  const result = await Product.paginate(filter, {
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
        perDocumentLimit: 1,
        populate: {
          path: 'images videos',
          select: 'imageUrl imageName isSelectedForMainScreen',
        },
      },
    ],
  });

  const docs = result.results || result.docs || [];

  /* eslint-disable no-param-reassign */
  docs.forEach((product) => {
    if (product && Array.isArray(product.variants)) {
      if (product.variants.length > 1) {
        product.variants = product.variants.slice(0, 1);
      }
      product.variants.forEach((variant) => {
        if (variant && typeof variant === 'object') {
          const price = Number(variant.price) || 0;
          const discount = Number(variant.discount) || 0;
          const discountAmount = Math.round(price * (discount / 100) * 100) / 100;
          const sellingPrice = Math.round((price - discountAmount) * 100) / 100;

          variant.discountAmount =
            variant.discountAmount !== undefined && variant.discountAmount !== null && variant.discountAmount !== 0
              ? variant.discountAmount
              : discountAmount;

          variant.sellingPrice =
            variant.sellingPrice !== undefined && variant.sellingPrice !== null ? variant.sellingPrice : sellingPrice;
        }
      });
    }

    if (
      (product.sellingPrice === undefined || product.sellingPrice === null) &&
      product.variants &&
      product.variants.length > 0 &&
      product.variants[0]
    ) {
      product.sellingPrice = product.variants[0].sellingPrice;
    }
  });
  /* eslint-enable no-param-reassign */

  return result;
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
                {
                  $match: {
                    isDeleted: { $ne: true },
                  },
                },

                {
                  $addFields: {
                    discountAmount: {
                      $round: [
                        {
                          $multiply: [
                            '$price',
                            {
                              $divide: ['$discount', 100],
                            },
                          ],
                        },
                        2,
                      ],
                    },
                  },
                },

                {
                  $addFields: {
                    sellingPrice: {
                      $round: [
                        {
                          $subtract: ['$price', '$discountAmount'],
                        },
                        2,
                      ],
                    },
                  },
                },

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
        let: { productId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$productId', '$$productId'] },
                  { $eq: ['$isAdminAprove', true] },
                  { $ne: ['$isDeleted', true] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: '$rating' },
            },
          },
        ],
        as: 'reviewSummary',
      },
    },

    //------------------------------------------------
    // ADD FIELDS FROM SUMMARY
    //------------------------------------------------
    {
      $addFields: {
        totalReviews: {
          $ifNull: [{ $arrayElemAt: ['$reviewSummary.totalReviews', 0] }, 0],
        },

        averageRating: {
          $round: [
            {
              $ifNull: [{ $arrayElemAt: ['$reviewSummary.averageRating', 0] }, 0],
            },
            1,
          ],
        },
      },
    },

    //------------------------------------------------
    // REMOVE reviewSummary FIELD
    //------------------------------------------------
    {
      $project: {
        reviewSummary: 0,
      },
    },

    //------------------------------------------------
    // WISHLIST
    //------------------------------------------------
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
                        {
                          $ne: ['$isDeleted', true],
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

    //------------------------------------------------
    // STORE
    //------------------------------------------------
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

    //------------------------------------------------
    // SELLER
    //------------------------------------------------
    {
      $lookup: {
        from: 'SellerUser',
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

    //------------------------------------------------
    // PRODUCT TYPE
    //------------------------------------------------
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

    //------------------------------------------------
    // BRAND
    //------------------------------------------------
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

    //------------------------------------------------
    // CATEGORY
    //------------------------------------------------
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

    //------------------------------------------------
    // VARIANTS
    //------------------------------------------------
    {
      $lookup: {
        from: 'ProductVarientByProductId',
        localField: 'variants',
        foreignField: '_id',
        as: 'variants',
        pipeline: [
          {
            $match: {
              isDeleted: { $ne: true },
            },
          },

          {
            $addFields: {
              discountAmount: {
                $round: [
                  {
                    $multiply: [
                      '$price',
                      {
                        $divide: ['$discount', 100],
                      },
                    ],
                  },
                  2,
                ],
              },
            },
          },

          {
            $addFields: {
              sellingPrice: {
                $round: [
                  {
                    $subtract: ['$price', '$discountAmount'],
                  },
                  2,
                ],
              },
            },
          },

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
                {
                  $match: {
                    isDeleted: { $ne: true },
                  },
                },

                {
                  $addFields: {
                    discountAmount: {
                      $round: [
                        {
                          $multiply: [
                            '$price',
                            {
                              $divide: [{ $ifNull: ['$discount', 0] }, 100],
                            },
                          ],
                        },
                        2,
                      ],
                    },
                  },
                },

                {
                  $addFields: {
                    sellingPrice: {
                      $round: [
                        {
                          $subtract: [
                            '$price',
                            {
                              $multiply: [
                                '$price',
                                {
                                  $divide: [{ $ifNull: ['$discount', 0] }, 100],
                                },
                              ],
                            },
                          ],
                        },
                        2,
                      ],
                    },
                  },
                },

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
export function parseSearchQuery(searchQuery = '') {
  const query = searchQuery.toLowerCase();

  let gender = null;

  if (/\b(men|man|male|boy|boys)\b/i.test(query)) {
    gender = 'men';
  }

  if (/\b(women|woman|female|girl|girls)\b/i.test(query)) {
    gender = 'women';
  }

  let maxPrice = null;

  const underMatch = query.match(/under\s+(\d+)/i);

  if (underMatch) {
    maxPrice = Number(underMatch[1]);
  }

  const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'pink'];

  const color = colors.find((c) => query.includes(c)) || null;

  const keyword = query
    .replace(/\b(men|man|male|boy|boys)\b/gi, '')
    .replace(/\b(women|woman|female|girl|girls)\b/gi, '')
    .replace(/under\s+\d+/gi, '')
    .replace(/\b(black|white|blue|red|green|yellow|pink)\b/gi, '')
    .trim();

  return {
    keyword,
    gender,
    maxPrice,
    color,
  };
}

export async function searchProducts(params, userId = null) {
  const { keyword = '', categoryId, brandId, storeId, sellerId, sortBy = 'relevance' } = params;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const skip = (page - 1) * limit;

  // ==========================================
  // PARSE SMART QUERY
  // ==========================================

  const parsed = parseSearchQuery(keyword);

  const { keyword: smartKeyword, gender, minPrice, maxPrice, color } = parsed;

  // ==========================================
  // AMAZON LIKE SEARCH REGEX
  // ==========================================

  // eslint-disable-next-line security/detect-non-literal-regexp
  const keywordRegex = new RegExp(
    smartKeyword
      .replace(/shirt/gi, '(shirt|tshirt|t-shirt|tee)')
      .replace(/tshirt/gi, '(shirt|tshirt|t-shirt|tee)')
      .replace(/shoe/gi, '(shoe|sneaker)')
      .replace(/mobile/gi, '(mobile|phone|smartphone)')
      .replace(/\s+/g, '.*'),
    'i'
  );

  // ==========================================
  // BASE MATCH
  // ==========================================

  const match = {
    isDeleted: { $ne: true },
  };

  if (categoryId) {
    match.productCategoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (brandId) {
    match.brandId = new mongoose.Types.ObjectId(brandId);
  }

  if (storeId) {
    match.storeId = new mongoose.Types.ObjectId(storeId);
  }

  if (sellerId) {
    match.sellerId = new mongoose.Types.ObjectId(sellerId);
  }

  // ==========================================
  // PIPELINE
  // ==========================================

  const pipeline = [
    {
      $match: match,
    },

    // ==========================================
    // PRODUCT TYPE
    // ==========================================

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

    // ==========================================
    // CATEGORY
    // ==========================================

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

    // ==========================================
    // BRAND
    // ==========================================

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

    // ==========================================
    // STORE
    // ==========================================

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

    // ==========================================
    // SELLER
    // ==========================================

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

    // ==========================================
    // REVIEWS
    // ==========================================

    {
      $lookup: {
        from: 'Review',
        let: { productId: '$_id' },

        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$productId', '$$productId'] },
                  { $eq: ['$isAdminAprove', true] },
                  { $ne: ['$isDeleted', true] },
                ],
              },
            },
          },

          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: '$rating' },
            },
          },

          {
            $project: {
              _id: 0,
              totalReviews: 1,
              averageRating: {
                $round: ['$averageRating', 1],
              },
            },
          },
        ],

        as: 'reviewSummary',
      },
    },

    // ==========================================
    // WISHLIST
    // ==========================================

    ...(userId
      ? [
          {
            $lookup: {
              from: 'Wishlist',

              let: {
                productId: '$_id',
              },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$productId', '$$productId'],
                        },
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

    // ==========================================
    // VARIANTS
    // ==========================================

    {
      $lookup: {
        from: 'ProductVarientByProductId',
        localField: 'variants',
        foreignField: '_id',
        as: 'variants',
        pipeline: [
          {
            $match: {
              isDeleted: { $ne: true },
            },
          },

          {
            $addFields: {
              discountAmount: {
                $round: [
                  {
                    $multiply: [
                      '$price',
                      {
                        $divide: [{ $ifNull: ['$discount', 0] }, 100],
                      },
                    ],
                  },
                  2,
                ],
              },

              sellingPrice: {
                $round: [
                  {
                    $subtract: [
                      '$price',
                      {
                        $multiply: [
                          '$price',
                          {
                            $divide: [{ $ifNull: ['$discount', 0] }, 100],
                          },
                        ],
                      },
                    ],
                  },
                  2,
                ],
              },
            },
          },

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

    // ==========================================
    // FINAL PRICE
    // ==========================================

    {
      $addFields: {
        finalPrice: {
          $cond: [
            '$variantsEnabled',
            {
              $min: '$variants.price',
            },
            '$sellingPrice',
          ],
        },
      },
    },
  ];

  // ======================================================
  // GENDER FILTER
  // ======================================================

  if (gender) {
    let genderKeywords = [];

    // MEN
    if (['men', 'man', 'male', 'boys', 'boy'].includes(gender.toLowerCase())) {
      genderKeywords = ['men', 'man', 'male', 'boys', 'boy'];
    }

    // WOMEN
    if (['women', 'woman', 'female', 'girls', 'girl'].includes(gender.toLowerCase())) {
      genderKeywords = ['women', 'woman', 'female', 'girls', 'girl'];
    }

    pipeline.push({
      $match: {
        $or: [
          {
            'productType.value': {
              // eslint-disable-next-line security/detect-non-literal-regexp
              $regex: new RegExp(`^(${genderKeywords.join('|')})$`, 'i'),
            },
          },

          {
            title: {
              // eslint-disable-next-line security/detect-non-literal-regexp
              $regex: new RegExp(`\\b(${genderKeywords.join('|')})\\b`, 'i'),
            },
          },

          {
            description: {
              // eslint-disable-next-line security/detect-non-literal-regexp
              $regex: new RegExp(`\\b(${genderKeywords.join('|')})\\b`, 'i'),
            },
          },
        ],
      },
    });
  }
  // ==========================================
  // SAVE RECENT SEARCH
  // ==========================================

  if (userId && keyword && keyword.trim()) {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        recentSearches: keyword.toLowerCase(),
      },
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        recentSearches: {
          $each: [keyword.toLowerCase()],
          $position: 0,
          $slice: 10,
        },
      },
    });
  }
  // ======================================================
  // PRICE FILTER
  // ======================================================

  if (minPrice || maxPrice) {
    pipeline.push({
      $match: {
        finalPrice: {
          ...(minPrice && { $gte: Number(minPrice) }),
          ...(maxPrice && { $lte: Number(maxPrice) }),
        },
      },
    });
  }

  // ======================================================
  // COLOR FILTER
  // ======================================================

  if (color) {
    pipeline.push({
      $match: {
        'variants.variants.value': {
          $regex: color,
          $options: 'i',
        },
      },
    });
  }

  // ======================================================
  // KEYWORD SEARCH
  // ======================================================

  if (smartKeyword) {
    pipeline.push({
      $match: {
        $or: [
          {
            title: {
              $regex: keywordRegex,
            },
          },

          {
            description: {
              $regex: keywordRegex,
            },
          },

          {
            productDetails: {
              $regex: keywordRegex,
            },
          },

          {
            'category.value': {
              $regex: keywordRegex,
            },
          },

          {
            'brand.name': {
              $regex: keywordRegex,
            },
          },

          {
            'store.name': {
              $regex: keywordRegex,
            },
          },

          {
            'seller.businessName': {
              $regex: keywordRegex,
            },
          },

          {
            specifications: {
              $elemMatch: {
                value: {
                  $regex: keywordRegex,
                },
              },
            },
          },
        ],
      },
    });

    // ==========================================
    // RELEVANCE SCORE
    // ==========================================

    pipeline.push({
      $addFields: {
        relevanceScore: {
          $add: [
            {
              $cond: [
                {
                  $regexMatch: {
                    input: '$title',
                    regex: keywordRegex,
                  },
                },
                10,
                0,
              ],
            },

            {
              $cond: [
                {
                  $regexMatch: {
                    input: '$description',
                    regex: keywordRegex,
                  },
                },
                5,
                0,
              ],
            },

            {
              $cond: [
                {
                  $gt: [
                    {
                      $size: '$reviewSummary',
                    },
                    0,
                  ],
                },
                2,
                0,
              ],
            },
          ],
        },
      },
    });
  }

  // ======================================================
  // SORTING
  // ======================================================

  let sort = {
    relevanceScore: -1,
    createdAt: -1,
  };

  if (sortBy === 'priceLow') {
    sort = {
      finalPrice: 1,
    };
  }

  if (sortBy === 'priceHigh') {
    sort = {
      finalPrice: -1,
    };
  }

  if (sortBy === 'latest') {
    sort = {
      createdAt: -1,
    };
  }

  pipeline.push({
    $sort: sort,
  });

  // ======================================================
  // PAGINATION
  // ======================================================

  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: 'count' }],
    },
  });

  // ======================================================
  // EXECUTE
  // ======================================================

  const result = await Product.aggregate(pipeline);

  const first = result && result.length ? result[0] : null;

  const totalCount =
    first && first.totalCount && first.totalCount[0] && first.totalCount[0].count ? first.totalCount[0].count : 0;

  return {
    results: first && first.data ? first.data : [],
    totalResults: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
    limit,
  };
}

export async function searchSuggestions(keyword = '') {
  if (!keyword) {
    return [];
  }

  const suggestions = await Product.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },

        $or: [
          {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          },

          {
            description: {
              $regex: keyword,
              $options: 'i',
            },
          },
        ],
      },
    },

    {
      $project: {
        title: 1,
      },
    },

    {
      $group: {
        _id: null,

        suggestions: {
          $addToSet: '$title',
        },
      },
    },

    {
      $project: {
        _id: 0,

        suggestions: {
          $slice: ['$suggestions', 10],
        },
      },
    },
  ]);

  return suggestions[0] && suggestions[0].suggestions ? suggestions[0].suggestions : [];
}
