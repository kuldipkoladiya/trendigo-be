import httpStatus from 'http-status';
import { cartService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  const filter = {
    _id: cartId,
  };
  const options = {};
  const cart = await cartService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: cart });
});

export const listCart = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const cart = await cartService.getCartList(filter, options);
  return res.status(httpStatus.OK).send({ results: cart });
});

export const paginateCart = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const cart = await cartService.getCartListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: cart });
});

export const createCart = catchAsync(async (req, res) => {
  const cart = await cartService.createCart(req.body, req.user._id);

  return res.status(httpStatus.CREATED).send({
    results: cart,
  });
});

export const updateCart = catchAsync(async (req, res) => {
  const cart = await cartService.updateCart(req.user._id, req.body);

  return res.status(httpStatus.OK).send({
    results: cart,
  });
});

export const removeCart = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  const filter = {
    _id: cartId,
  };
  const cart = await cartService.removeCart(filter);
  return res.status(httpStatus.OK).send({ results: cart });
});

export const getUserCart = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const filter = {
    userId,
  };

  const options = {};
  const cart = await cartService.getCartList(filter, options);
  return res.status(httpStatus.OK).send({ results: cart });
});
