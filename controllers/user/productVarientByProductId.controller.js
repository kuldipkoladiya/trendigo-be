import httpStatus from 'http-status';
import { productVarientByProductIdService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getProductVarientByProductId = catchAsync(async (req, res) => {
  const { productVarientByProductIdId } = req.params;
  const filter = {
    _id: productVarientByProductIdId,
  };
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});

export const listProductVarientByProductId = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.getProductVarientByProductIdList(filter, options);
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});

export const paginateProductVarientByProductId = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.getProductVarientByProductIdListWithPagination(
    filter,
    options
  );
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});

export const createProductVarientByProductId = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.createProductVarientByProductId(body, options);
  return res.status(httpStatus.CREATED).send({ results: productVarientByProductId });
});

export const updateProductVarientByProductId = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { productVarientByProductIdId } = req.params;
  const filter = {
    _id: productVarientByProductIdId,
  };
  const options = { new: true };
  const productVarientByProductId = await productVarientByProductIdService.updateProductVarientByProductId(
    filter,
    body,
    options
  );
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});

export const removeProductVarientByProductId = catchAsync(async (req, res) => {
  const { productVarientByProductIdId } = req.params;
  const filter = {
    _id: productVarientByProductIdId,
  };
  const productVarientByProductId = await productVarientByProductIdService.removeProductVarientByProductId(filter);
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});

export const getVarientByProductId = catchAsync(async (req, res) => {
  const { ProductId } = req.params;
  const filter = {
    ProductId,
  };
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.getProductVarientByProductIdList(filter, options);
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});
