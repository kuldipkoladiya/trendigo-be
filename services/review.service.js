import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Review, Product } from 'models';

export async function getReviewById(id, options = {}) {
  const review = await Review.findById(id, options.projection, options);
  return review;
}

export async function getOne(query, options = {}) {
  const review = await Review.findOne(query, options.projection, options);
  return review;
}

export async function getReviewList(filter, options = {}) {
  const review = await Review.find(filter, options.projection, options);
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
