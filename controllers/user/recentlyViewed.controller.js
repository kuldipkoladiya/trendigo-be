import httpStatus from 'http-status';
import { recentlyViewedService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getRecentlyViewed = catchAsync(async (req, res) => {
  const { recentlyViewedId } = req.params;
  const filter = {
    _id: recentlyViewedId,
  };
  const options = {};
  const recentlyViewed = await recentlyViewedService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: recentlyViewed });
});

export const listRecentlyViewed = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const recentlyViewed = await recentlyViewedService.getRecentlyViewedList(filter, options);
  return res.status(httpStatus.OK).send({ results: recentlyViewed });
});

export const paginateRecentlyViewed = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const recentlyViewed = await recentlyViewedService.getRecentlyViewedListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: recentlyViewed });
});

export const createRecentlyViewed = catchAsync(async (req, res) => {
  const { body } = req;

  // set from auth user
  body.userId = req.user._id;

  // audit fields
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;

  const options = {};
  const recentlyViewed = await recentlyViewedService.createRecentlyViewed(body, options);

  return res.status(httpStatus.CREATED).send({ results: recentlyViewed });
});

export const updateRecentlyViewed = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { recentlyViewedId } = req.params;
  const filter = {
    _id: recentlyViewedId,
  };
  const options = { new: true };
  const recentlyViewed = await recentlyViewedService.updateRecentlyViewed(filter, body, options);
  return res.status(httpStatus.OK).send({ results: recentlyViewed });
});

export const removeRecentlyViewed = catchAsync(async (req, res) => {
  const { recentlyViewedId } = req.params;
  const filter = {
    _id: recentlyViewedId,
  };
  const recentlyViewed = await recentlyViewedService.removeRecentlyViewed(filter);
  return res.status(httpStatus.OK).send({ results: recentlyViewed });
});

export const getRecentlyViewedByUser = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;

  const userId = req.user && req.user._id ? req.user._id : null;
  const response = await recentlyViewedService.getRecentlyViewedListPaginate(userId, page, limit);

  return res.status(200).json({
    status: 'Success',
    ...response,
  });
});
