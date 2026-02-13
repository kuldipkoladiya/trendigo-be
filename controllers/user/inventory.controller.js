import httpStatus from 'http-status';
import { inventoryService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getInventory = catchAsync(async (req, res) => {
  const { inventoryId } = req.params;
  const filter = {
    _id: inventoryId,
  };
  const options = {};
  const inventory = await inventoryService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: inventory });
});

export const getInventoryBystoreId = catchAsync(async (req, res) => {
  const { storeId } = req.params;
  const filter = {
    store: storeId,
  };
  const options = {};
  const inventory = await inventoryService.getInventoryList(filter, options);
  return res.status(httpStatus.OK).send({ results: inventory });
});
export const listInventory = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const inventory = await inventoryService.getInventoryList(filter, options);
  return res.status(httpStatus.OK).send({ results: inventory });
});

export const paginateInventory = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const inventory = await inventoryService.getInventoryListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: inventory });
});

export const createInventory = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const inventory = await inventoryService.createInventory(body, options);
  return res.status(httpStatus.CREATED).send({ results: inventory });
});

export const updateInventory = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { inventoryId } = req.params;
  const filter = {
    _id: inventoryId,
  };
  const options = { new: true };
  const inventory = await inventoryService.updateInventory(filter, body, options);
  return res.status(httpStatus.OK).send({ results: inventory });
});

export const removeInventory = catchAsync(async (req, res) => {
  const { inventoryId } = req.params;
  const filter = {
    _id: inventoryId,
  };
  const inventory = await inventoryService.removeInventory(filter);
  return res.status(httpStatus.OK).send({ results: inventory });
});
