import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Review, Product } from 'models';
import mongoose from 'mongoose';

export async function getReviewById(id, options = {}) {
  const review = await Review.findById(id, options.projection, options);
  return review;
}

export async function getOne(query, options = {}) {
  const review = await Review.findOne(query, options.projection, options);
  return review;
}

export async function getReviewListWithPagination(filter, options = {}) {
  const review = await Review.paginate(filter, options);
  return review;
}

export async function createReview(body = {}) {
  if (body.productId) {
    const productId = await Product.findOne({ _id: body.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productId is not valid');
    }
  }
  const review = await Review.create(body);
  return review;
}

export async function updateReview(filter, body, options = {}) {
  if (body.productId) {
    const productId = await Product.findOne({ _id: body.productId });
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field productId is not valid');
    }
  }
  const review = await Review.findOneAndUpdate(filter, body, options);
  return review;
}

export async function getReviewList(filter = {}, options = {}) {
  const review = await Review.find(filter, options.projection, options);

  return review;
}
export async function updateManyReview(filter, body, options = {}) {
  const review = await Review.updateMany(filter, body, options);
  return review;
}

export async function removeReview(filter) {
  const review = await Review.findOneAndRemove(filter);
  return review;
}

export async function removeManyReview(filter) {
  const review = await Review.deleteMany(filter);
  return review;
}

export async function aggregateReview(query) {
  const review = await Review.aggregate(query);
  return review;
}

// export async function aggregateReviewWithPagination(query, options = {}) {
//   const aggregate = Review.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const review = await Review.aggregatePaginate(aggregate, options);
//   return review;
// }

export async function getApprovedReviewSummaryWithPopulate(productId, { page = 1, limit = 10 } = {}) {
  const productObjectId = new mongoose.Types.ObjectId(productId);
  const skip = (page - 1) * limit;

  const result = await Review.aggregate([
    {
      $match: {
        productId: productObjectId,
        isDeleted: false,
      },
    },

    // ✅ PRODUCT LOOKUP
    {
      $lookup: {
        from: 'Product', // verify collection name
        let: { productId: '$productId' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$productId'] },
            },
          },
          {
            $project: {
              title: 1,
              images: 1,
            },
          },
        ],
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },

    // 🔹 populate seller
    {
      $lookup: {
        from: 'SellerUser',
        localField: 'sellerId',
        foreignField: '_id',
        as: 'seller',
      },
    },
    { $unwind: '$seller' },

    // ✅ USER LOOKUP
    {
      $lookup: {
        from: 'User',
        let: {
          userId: {
            $cond: {
              if: { $eq: [{ $type: '$userId' }, 'objectId'] },
              then: '$userId',
              else: { $toObjectId: '$userId' },
            },
          },
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$userId'] },
            },
          },
          {
            $project: {
              name: 1,
              profilePic: 1,
              email: 1,
            },
          },
        ],
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              product: { $first: '$product' },
              seller: { $first: '$seller' },
            },
          },
        ],

        totalCount: [{ $count: 'count' }],

        ratingBreakdown: [
          {
            $group: {
              _id: { $floor: '$rating' },
              count: { $sum: 1 },
            },
          },
        ],

        reviews: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              rating: 1,
              title: 1,
              description: 1,
              createdAt: 1,
              productImages: 1,
              user: {
                _id: '$user._id',
                name: '$user.name',
                profilePic: '$user.profilePic',
              },
            },
          },
        ],
      },
    },
  ]);

  const data = result.length ? result[0] : {};

  const summary = data.summary && data.summary.length ? data.summary[0] : {};

  const totalReviews = data.totalCount && data.totalCount.length ? data.totalCount[0].count : 0;

  // ✅ Rating Map
  const ratingMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (data.ratingBreakdown) {
    data.ratingBreakdown.forEach(function (item) {
      ratingMap[item._id] = item.count;
    });
  }

  const avg = summary.averageRating != null ? Number(summary.averageRating.toFixed(1)) : 0;

  const totalPages = Math.ceil(totalReviews / limit);

  return {
    averageRating: avg,
    totalReviews,

    ratingBreakdown: ratingMap,

    product: summary.product
      ? {
          _id: summary.product._id,
          title: summary.product.title,
        }
      : null,

    seller: summary.seller
      ? {
          _id: summary.seller._id,
          name: summary.seller.name,
          email: summary.seller.email,
        }
      : null,

    pagination: {
      totalReviews,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },

    reviews: data.reviews || [],
  };
}

export async function getApprovedReviewSummaryBySellerId(sellerId, { page = 1, limit = 10 } = {}) {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
  const skip = (page - 1) * limit;

  const result = await Review.aggregate([
    {
      $match: {
        sellerId: sellerObjectId,
        isDeleted: false,
      },
    },

    // ✅ Seller
    {
      $lookup: {
        from: 'SellerUser',
        let: { sellerId: '$sellerId' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$sellerId'] } } }, { $project: { name: 1, email: 1 } }],
        as: 'seller',
      },
    },
    {
      $unwind: {
        path: '$seller',
        preserveNullAndEmptyArrays: true,
      },
    },

    // ✅ Product
    {
      $lookup: {
        from: 'Product',
        let: { productId: '$productId' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$productId'] } } }, { $project: { title: 1, images: 1 } }],
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },

    // ✅ User
    {
      $lookup: {
        from: 'User',
        let: { userId: '$userId' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userId'] } } }, { $project: { name: 1, email: 1, profilePic: 1 } }],
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              seller: { $first: '$seller' },
            },
          },
        ],

        totalCount: [{ $count: 'count' }],

        ratingBreakdown: [
          {
            $group: {
              _id: { $floor: '$rating' },
              count: { $sum: 1 },
            },
          },
        ],

        reviews: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              rating: 1,
              title: 1,
              description: 1,
              createdAt: 1,
              productImages: 1,

              user: {
                _id: '$user._id',
                name: '$user.name',
                email: '$user.email',
                profilePic: '$user.profilePic',
              },

              product: {
                _id: '$product._id',
                title: '$product.title',
                images: '$product.images',
              },
            },
          },
        ],
      },
    },
  ]);

  const data = result.length ? result[0] : {};

  const summary = data.summary && data.summary.length ? data.summary[0] : {};

  const totalReviews = data.totalCount && data.totalCount.length ? data.totalCount[0].count : 0;

  // ✅ Rating Map
  const ratingMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (data.ratingBreakdown) {
    data.ratingBreakdown.forEach(function (item) {
      ratingMap[item._id] = item.count;
    });
  }

  const avg = summary.averageRating != null ? Number(summary.averageRating.toFixed(1)) : 0;

  const totalPages = Math.ceil(totalReviews / limit);

  return {
    averageRating: avg,
    totalReviews,

    ratingBreakdown: ratingMap,

    seller: summary.seller || null,

    pagination: {
      totalReviews,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },

    reviews: data.reviews || [],
  };
}
