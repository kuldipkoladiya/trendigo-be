import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { RecentlyViewed, Product } from 'models';
import mongoose from 'mongoose';

export async function getRecentlyViewedById(id, options = {}) {
  const recentlyViewed = await RecentlyViewed.findById(id, options.projection, options);
  return recentlyViewed;
}

export async function getOne(query, options = {}) {
  const recentlyViewed = await RecentlyViewed.findOne(query, options.projection, options);
  return recentlyViewed;
}

export async function getRecentlyViewedList(filter, options = {}) {
  const recentlyViewed = await RecentlyViewed.find(filter, options.projection, options);
  return recentlyViewed;
}

export async function getRecentlyViewedListWithPagination(filter, options = {}) {
  const recentlyViewed = await RecentlyViewed.paginate(filter, options);
  return recentlyViewed;
}

export const createRecentlyViewed = async (body) => {
  const { userId, productId, ...rest } = body;

  const existing = await RecentlyViewed.findOne({
    userId,
    productId,
    isDeleted: false,
  });

  if (existing) {
    existing.time = new Date();
    existing.updatedBy = userId;
    await existing.save();
    return existing;
  }

  const recentlyViewed = await RecentlyViewed.create({
    userId,
    productId,
    ...rest,
    time: new Date(),
  });

  return recentlyViewed;
};

export async function updateRecentlyViewed(filter, body, options = {}) {
  if (body.productId) {
    const productId = await Product.findOne({ _id: body.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productId is not valid');
    }
  }
  const recentlyViewed = await RecentlyViewed.findOneAndUpdate(filter, body, options);
  return recentlyViewed;
}

export async function updateManyRecentlyViewed(filter, body, options = {}) {
  const recentlyViewed = await RecentlyViewed.updateMany(filter, body, options);
  return recentlyViewed;
}

export async function removeRecentlyViewed(filter) {
  const recentlyViewed = await RecentlyViewed.findOneAndRemove(filter);
  return recentlyViewed;
}

export async function removeManyRecentlyViewed(filter) {
  const recentlyViewed = await RecentlyViewed.deleteMany(filter);
  return recentlyViewed;
}

export async function aggregateRecentlyViewed(query) {
  const recentlyViewed = await RecentlyViewed.aggregate(query);
  return recentlyViewed;
}

// export async function aggregateRecentlyViewedWithPagination(query, options = {}) {
//   const aggregate = RecentlyViewed.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const recentlyViewed = await RecentlyViewed.aggregatePaginate(aggregate, options);
//   return recentlyViewed;
// }

export async function getRecentlyViewedListPaginate(userId, page = 1, limit = 12) {
  try {
    if (!userId) {
      return {
        results: [],
        page,
        limit,
        totalResults: 0,
        totalPages: 0,
      };
    }

    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const pipeline = [
      {
        $match: {
          userId: userObjectId,
          isDeleted: { $ne: true },
        },
      },

      { $sort: { time: -1 } },

      {
        $lookup: {
          from: 'Product',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },

      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $addFields: {
          'product.viewedAt': '$time',
        },
      },

      {
        $replaceRoot: {
          newRoot: '$product',
        },
      },

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

      {
        $addFields: {
          averageRating: {
            $round: [{ $ifNull: [{ $avg: '$reviews.rating' }, 0] }, 1],
          },
          totalReviews: { $size: '$reviews' },
        },
      },

      { $unset: 'reviews' },

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
          isWishlisted: { $gt: [{ $size: '$wishlistData' }, 0] },
        },
      },

      // { $unset: 'wishlistData' },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          metaData: [{ $count: 'totalProducts' }],
        },
      },
    ];

    const result = await RecentlyViewed.aggregate(pipeline);

    const data = result && result[0] && result[0].data ? result[0].data : [];

    const total =
      result && result[0] && result[0].metaData && result[0].metaData[0] && result[0].metaData[0].totalProducts
        ? result[0].metaData[0].totalProducts
        : 0;

    return {
      results: data,
      page,
      limit,
      totalResults: total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('getRecentlyViewedListPaginate error:', error);
    throw error;
  }
}
