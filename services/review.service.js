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

export async function getReviewList(filter, options = {}) {
  const review = await Review.find(filter, options.projection, options).populate([
    { path: 'sellerId', select: 'name email' },
    { path: 'productId', select: 'title price images' },
  ]);
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

export async function getApprovedReviewSummaryWithPopulate(productId) {
  const productObjectId = new mongoose.Types.ObjectId(productId);

  const result = await Review.aggregate([
    {
      // ✅ only approved + not deleted
      $match: {
        productId: productObjectId,
        isDeleted: false,
      },
    },

    // 🔹 populate product
    {
      $lookup: {
        from: 'Product',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },

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

    {
      $facet: {
        // ⭐ summary
        summary: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              totalReviews: { $sum: 1 },
              product: { $first: '$product' },
              seller: { $first: '$seller' },
            },
          },
        ],

        // ⭐ rating breakdown
        ratingBreakdown: [
          {
            $group: {
              _id: '$rating',
              count: { $sum: 1 },
            },
          },
        ],

        // ⭐ reviews list
        reviews: [
          { $sort: { createdAt: -1 } },
          {
            $project: {
              _id: 1,
              rating: 1,
              description: 1,
              createdAt: 1,
              productImages: 1,
            },
          },
        ],
      },
    },
  ]);

  const summary = result && result[0] && result[0].summary && result[0].summary[0] ? result[0].summary[0] : {};

  const ratingMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  result[0].ratingBreakdown.forEach((item) => {
    ratingMap[Math.floor(item._id)] += item.count;
  });

  return {
    averageRating:
      summary && summary.averageRating !== undefined && summary.averageRating !== null
        ? Number(Number(summary.averageRating).toFixed(1))
        : 0,
    totalReviews: summary.totalReviews || 0,
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
    reviews: result && result[0] && result[0].reviews ? result[0].reviews : [],
  };
}
