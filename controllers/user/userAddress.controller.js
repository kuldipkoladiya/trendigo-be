import httpStatus from 'http-status';
import { userAddressService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getUserAddress = catchAsync(async (req, res) => {
  const { userAddressId } = req.params;
  const filter = {
    _id: userAddressId,
  };
  const options = {};
  const userAddress = await userAddressService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: userAddress });
});

export const listUserAddress = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const userAddress = await userAddressService.getUserAddressList(filter, options);
  return res.status(httpStatus.OK).send({ results: userAddress });
});

export const paginateUserAddress = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const userAddress = await userAddressService.getUserAddressListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: userAddress });
});

export const createUserAddress = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const userAddress = await userAddressService.createUserAddress(body, options);
  return res.status(httpStatus.CREATED).send({ results: userAddress });
});

export const updateUserAddress = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { userAddressId } = req.params;
  const filter = {
    _id: userAddressId,
  };
  const options = { new: true };
  const userAddress = await userAddressService.updateUserAddress(filter, body, options);
  return res.status(httpStatus.OK).send({ results: userAddress });
});

export const removeUserAddress = catchAsync(async (req, res) => {
  const { userAddressId } = req.params;
  const filter = {
    _id: userAddressId,
  };
  const userAddress = await userAddressService.removeUserAddress(filter);
  return res.status(httpStatus.OK).send({ results: userAddress });
});

export const getUserAddressByuserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    userId,
  };
  const options = {};
  const userAddress = await userAddressService.getUserAddressList(filter, options);
  return res.status(httpStatus.OK).send({ results: userAddress });
});
