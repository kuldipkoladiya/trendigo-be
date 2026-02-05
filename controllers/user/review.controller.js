import httpStatus from 'http-status';
import { s3Service, reviewService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import FileFieldValidationEnum from 'models/fileFieldValidation.model';
import mongoose from 'mongoose';
import TempS3 from 'models/tempS3.model';
import { asyncForEach } from 'utils/common';
import ApiError from 'utils/ApiError';
import { Review } from '../../models';

const moveFileAndUpdateTempS3 = async ({ url, newFilePath }) => {
  const newUrl = await s3Service.moveFile({ key: url, newFilePath });
  await TempS3.findOneAndUpdate({ url }, { url: newUrl });
  return newUrl;
};
// this is used to move file to new specified path as shown in basePath, used in create and update controller.
const moveFiles = async ({ body, user, moveFileObj }) => {
  await asyncForEach(Object.keys(moveFileObj), async (key) => {
    const fieldValidation = FileFieldValidationEnum[`${key}OfReview`];
    const basePath = `users/${user._id}/review/${body._id}/${key}/${mongoose.Types.ObjectId()}/`;
    if (Array.isArray(moveFileObj[key])) {
      const newUrlsArray = [];
      moveFileObj[key].map(async (ele) => {
        const filePath = `${mongoose.Types.ObjectId()}_${ele.split('/').pop()}`;
        newUrlsArray.push(moveFileAndUpdateTempS3({ url: ele, newFilePath: basePath + filePath }));
      });
      Object.assign(body, { ...body, [key]: await Promise.all(newUrlsArray) });
    } else {
      const filePath = `${mongoose.Types.ObjectId()}_${moveFileObj[key].split('/').pop()}`;
      Object.assign(body, {
        ...body,
        [key]: await moveFileAndUpdateTempS3({
          url: moveFileObj[key],
          newFilePath: basePath + filePath,
        }),
      });
      if (fieldValidation.generateThumbnails) {
        Object.assign(body, {
          ...body,
          [`thumbOf${key}`]: await s3Service.createThumbnails({
            url: moveFileObj[key],
            resolutions: fieldValidation.thumbnailResolutions,
          }),
        });
      }
    }
  });
};
export const getReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const filter = {
    _id: reviewId,
  };
  const options = {};
  const review = await reviewService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: review });
});

export const listReview = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const review = await reviewService.getReviewList(filter, options);
  return res.status(httpStatus.OK).send({ results: review });
});

export const paginateReview = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const review = await reviewService.getReviewListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: review });
});

export const createReview = catchAsync(async (req, res) => {
  const { body, user } = req;

  body.userId = user._id;
  body.createdBy = user._id;
  body.updatedBy = user._id;

  // ✅ prevent duplicate review
  const alreadyReviewed = await Review.exists({
    userId: user._id,
    productId: body.productId,
    isDeleted: false,
  });

  if (alreadyReviewed) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  const moveFileObj = {
    ...(body.productImages && { productImages: body.productImages }),
  };

  body._id = new mongoose.Types.ObjectId();

  await moveFiles({ body, user, moveFileObj });

  const reviewResult = await reviewService.createReview(body, {});

  const images = (reviewResult && reviewResult.productImages) || [];

  if (images.length) {
    await TempS3.updateMany({ url: { $in: images } }, { $set: { active: true } });
  }

  return res.status(httpStatus.CREATED).send({
    results: reviewResult,
  });
});
export const updateReview = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { reviewId } = req.params;
  const { user } = req;
  const moveFileObj = {
    ...(body.productImages && { productImages: body.productImages }),
  };
  body._id = reviewId;
  await moveFiles({ body, user, moveFileObj });
  const filter = {
    _id: reviewId,
  };
  const options = { new: true };
  const reviewResult = await reviewService.updateReview(filter, body, options);
  // tempS3
  if (reviewResult) {
    const uploadedFileUrls = [];
    uploadedFileUrls.push(reviewResult.productImages);
    await TempS3.updateMany({ url: { $in: uploadedFileUrls } }, { active: true });
  }
  return res.status(httpStatus.OK).send({ results: reviewResult });
});

export const removeReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const filter = {
    _id: reviewId,
  };
  const review = await reviewService.removeReview(filter);
  return res.status(httpStatus.OK).send({ results: review });
});

export const getReviewByproductId = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const reviewData = await reviewService.getApprovedReviewSummaryWithPopulate(productId, { page, limit });

  return res.status(httpStatus.OK).send({
    status: 'Success',
    results: reviewData,
  });
});

export const getReviewBysellerId = catchAsync(async (req, res) => {
  const { sellerId } = req.params;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const reviewData = await reviewService.getApprovedReviewSummaryBySellerId(sellerId, { page, limit });

  return res.status(httpStatus.OK).send({
    status: 'Success',
    results: reviewData,
  });
});
