import httpStatus from 'http-status';
import { userWishlistService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getUserWishlist = catchAsync(async (req, res) => {
  const { userWishlistId } = req.params;
  const filter = {
    _id: userWishlistId,
  };
  const options = {};
  const userWishlist = await userWishlistService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: userWishlist });
});

export const listUserWishlist = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const userWishlist = await userWishlistService.getUserWishlistList(filter, options);
  return res.status(httpStatus.OK).send({ results: userWishlist });
});

export const paginateUserWishlist = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const userWishlist = await userWishlistService.getUserWishlistListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: userWishlist });
});

export const createUserWishlist = catchAsync(async (req, res) => {
  const { body } = req;

  body.userId = req.user._id; // ✅ from auth
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;

  const userWishlist = await userWishlistService.createUserWishlist(body);

  return res.status(httpStatus.CREATED).send({
    results: userWishlist,
  });
});
export const updateUserWishlist = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { userWishlistId } = req.params;
  const filter = {
    _id: userWishlistId,
  };
  const options = { new: true };
  const userWishlist = await userWishlistService.updateUserWishlist(filter, body, options);
  return res.status(httpStatus.OK).send({ results: userWishlist });
});

export const removeUserWishlist = catchAsync(async (req, res) => {
  const { userWishlistId } = req.params;
  const filter = {
    _id: userWishlistId,
  };
  const userWishlist = await userWishlistService.removeUserWishlist(filter);
  return res.status(httpStatus.OK).send({ results: userWishlist });
});

export const userWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const filter = {
    userId,
    isDeleted: false,
  };

  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sort: { createdAt: -1 },
    populate: [
      {
        path: 'productId',
        populate: [
          {
            path: 'variants',
            populate: {
              path: 'images',
              select: 'imageUrl imageName isSelectedForMainScreen',
            },
          },
          {
            path: 'brandId',
          },
          {
            path: 'sellerId',
            select: 'name email',
          },
          {
            path: 'storeId',
            select: 'name',
          },
          {
            path: 'productCategoryId',
          },
          {
            path: 'productTypeId',
          },
        ],
      },
    ],
  };

  const userwishlist = await userWishlistService.getUserWishlistListWithPagination(filter, options);

  return res.status(httpStatus.OK).send({
    results: userwishlist,
  });
});
