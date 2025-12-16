import httpStatus from 'http-status';
import { productTypeService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getProductType = catchAsync(async (req, res) => {
  const { productTypeId } = req.params;
  const filter = {
    _id: productTypeId,
  };
  const options = {};
  const productType = await productTypeService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: productType });
});

export const listProductType = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const productType = await productTypeService.getProductTypeList(filter, options);
  return res.status(httpStatus.OK).send({ results: productType });
});

export const paginateProductType = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const productType = await productTypeService.getProductTypeListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: productType });
});

export const createProductType = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const productType = await productTypeService.createProductType(body, options);
  return res.status(httpStatus.CREATED).send({ results: productType });
});

export const updateProductType = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { productTypeId } = req.params;
  const filter = {
    _id: productTypeId,
  };
  const options = { new: true };
  const productType = await productTypeService.updateProductType(filter, body, options);
  return res.status(httpStatus.OK).send({ results: productType });
});

export const removeProductType = catchAsync(async (req, res) => {
  const { productTypeId } = req.params;
  const filter = {
    _id: productTypeId,
  };
  const productType = await productTypeService.removeProductType(filter);
  return res.status(httpStatus.OK).send({ results: productType });
});
