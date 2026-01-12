import httpStatus from 'http-status';
import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = {};
  const product = await productService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const getSellerProduct = catchAsync(async (req, res) => {
  const { sellerId } = req.params;
  const filter = {
    sellerId,
  };
  const options = {};
  const product = await productService.getProductList(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});
export const listProduct = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductList(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const paginateProduct = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const createProduct = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const product = await productService.createProduct(body, options);
  return res.status(httpStatus.CREATED).send({ results: product });
});

export const updateProduct = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = { new: true };
  const product = await productService.updateProduct(filter, body, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const removeProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const product = await productService.removeProduct(filter);
  return res.status(httpStatus.OK).send({ results: product });
});
