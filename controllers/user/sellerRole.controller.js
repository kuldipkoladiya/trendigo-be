import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sellerRoleService } from '../../services';
import ApiError from '../../utils/ApiError';

export const add = catchAsync(async (req, res) => {
  if (!req.user.storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please create a store first before managing roles.');
  }
  const body = { ...req.body, storeId: req.user.storeId };
  const options = {};
  const role = await sellerRoleService.createRole(body, options);
  return res.status(httpStatus.CREATED).send({ results: role });
});

export const list = catchAsync(async (req, res) => {
  if (!req.user.storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please create a store first.');
  }
  const filter = { storeId: req.user.storeId };
  const options = {};
  const roles = await sellerRoleService.getRoleList(filter, options);
  return res.status(httpStatus.OK).send({ results: roles });
});

export const update = catchAsync(async (req, res) => {
  if (!req.user.storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please create a store first.');
  }
  const { body } = req;
  const { roleId } = req.params;
  const filter = {
    _id: roleId,
    storeId: req.user.storeId,
  };
  const options = { new: true };
  const role = await sellerRoleService.updateRole(filter, body, options);
  return res.status(httpStatus.OK).send({ results: role });
});

export const Delete = catchAsync(async (req, res) => {
  if (!req.user.storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please create a store first.');
  }
  const { roleId } = req.params;
  const filter = {
    _id: roleId,
    storeId: req.user.storeId,
  };
  const options = {};
  const role = await sellerRoleService.deleteRole(filter, options);
  return res.status(httpStatus.OK).send({ results: role });
});
