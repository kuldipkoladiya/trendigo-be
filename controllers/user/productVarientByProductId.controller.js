import httpStatus from 'http-status';
import { productVarientByProductIdService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import ApiError from 'utils/ApiError';
import ProductVarientByProductId from '../../models/productVarientByProductId.model';

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
  const { productVarientByProductIdId } = req.params;
  const { user, body } = req;

  const update = {
    updatedBy: user._id,
  };

  // only set fields if present
  if (body.variants) update.variants = body.variants;
  if (body.quantity !== undefined) update.quantity = body.quantity;
  if (body.price !== undefined) update.price = body.price;
  if (body.discount !== undefined) update.discount = body.discount;
  if (body.sku) update.sku = body.sku;

  const productVarient = await ProductVarientByProductId.findByIdAndUpdate(productVarientByProductIdId, update, {
    new: true,
  });

  if (!productVarient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }

  // add images safely (no duplicates)
  if (body.images && body.images.length > 0) {
    await ProductVarientByProductId.findByIdAndUpdate(productVarientByProductIdId, {
      $addToSet: {
        images: { $each: body.images },
      },
    });
  }

  return res.status(httpStatus.OK).send({
    status: 'Success',
    results: productVarient,
  });
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
  const { productId } = req.params;
  const filter = {
    productId,
  };
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.getProductVarientByProductIdList(filter, options);
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});

export const getVarientColor = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    productId,
  };
  const options = {};
  const productVarientByProductId = await productVarientByProductIdService.getProductVarientColorList(filter, options);
  return res.status(httpStatus.OK).send({ results: productVarientByProductId });
});
