import httpStatus from 'http-status';
import { sellerPolicyService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getSellerPolicy = catchAsync(async (req, res) => {
  const { sellerPolicyId } = req.params;
  const filter = {
    _id: sellerPolicyId,
  };
  const options = {};
  const sellerPolicy = await sellerPolicyService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: sellerPolicy });
});

export const listSellerPolicy = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const sellerPolicy = await sellerPolicyService.getSellerPolicyList(filter, options);
  return res.status(httpStatus.OK).send({ results: sellerPolicy });
});

export const paginateSellerPolicy = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const sellerPolicy = await sellerPolicyService.getSellerPolicyListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: sellerPolicy });
});

export const createSellerPolicy = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const sellerPolicy = await sellerPolicyService.createSellerPolicy(body, options);
  return res.status(httpStatus.CREATED).send({ results: sellerPolicy });
});

export const updateSellerPolicy = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { sellerPolicyId } = req.params;
  const filter = {
    _id: sellerPolicyId,
  };
  const options = { new: true };
  const sellerPolicy = await sellerPolicyService.updateSellerPolicy(filter, body, options);
  return res.status(httpStatus.OK).send({ results: sellerPolicy });
});

export const removeSellerPolicy = catchAsync(async (req, res) => {
  const { sellerPolicyId } = req.params;
  const filter = {
    _id: sellerPolicyId,
  };
  const sellerPolicy = await sellerPolicyService.removeSellerPolicy(filter);
  return res.status(httpStatus.OK).send({ results: sellerPolicy });
});

export const getSellerPolicyByStoreId = catchAsync(async (req, res) => {
  const { storeId } = req.params;
  const filter = {
    store: storeId,
  };
  const options = {};
  const sellerPolicy = await sellerPolicyService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: sellerPolicy });
});
