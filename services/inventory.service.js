import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { Inventory, Store, InventoryAddress } from 'models';

export async function getInventoryById(id, options = {}) {
  const inventory = await Inventory.findById(id, options.projection, options);
  return inventory;
}

export async function getOne(query, options = {}) {
  const inventory = await Inventory.findOne(query, options.projection, options);
  return inventory;
}

export async function getInventoryList(filter, options = {}) {
  const inventory = await Inventory.find(filter, options.projection, options).populate('sourceAddressId');

  return inventory;
}

export async function getInventoryListWithPagination(filter, options = {}) {
  const inventory = await Inventory.paginate(filter, options);
  return inventory;
}

export async function createInventory(body = {}) {
  if (body.store) {
    const store = await Store.findOne({ _id: body.store });
    if (!store) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field store is not valid');
    }
  }
  if (body.sourceAddressId) {
    const sourceAddressId = await InventoryAddress.findOne({ _id: body.sourceAddressId });
    if (!sourceAddressId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field sourceAddressId is not valid');
    }
  }
  const inventory = await Inventory.create(body);
  return inventory;
}

export async function updateInventory(filter, body, options = {}) {
  if (body.store) {
    const store = await Store.findOne({ _id: body.store });
    if (!store) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field store is not valid');
    }
  }
  if (body.sourceAddressId) {
    const sourceAddressId = await InventoryAddress.findOne({ _id: body.sourceAddressId });
    if (!sourceAddressId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field sourceAddressId is not valid');
    }
  }
  const inventory = await Inventory.findOneAndUpdate(filter, body, options);
  return inventory;
}

export async function updateManyInventory(filter, body, options = {}) {
  const inventory = await Inventory.updateMany(filter, body, options);
  return inventory;
}

export async function removeInventory(filter) {
  const inventory = await Inventory.findOneAndRemove(filter);
  return inventory;
}

export async function removeManyInventory(filter) {
  const inventory = await Inventory.deleteMany(filter);
  return inventory;
}

export async function aggregateInventory(query) {
  const inventory = await Inventory.aggregate(query);
  return inventory;
}

// export async function aggregateInventoryWithPagination(query, options = {}) {
//   const aggregate = Inventory.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const inventory = await Inventory.aggregatePaginate(aggregate, options);
//   return inventory;
// }
