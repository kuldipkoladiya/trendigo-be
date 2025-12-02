import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { BankDetails, Store } from 'models';

export async function getBankDetailsById(id, options = {}) {
  const bankDetails = await BankDetails.findById(id, options.projection, options);
  return bankDetails;
}

export async function getOne(query, options = {}) {
  const bankDetails = await BankDetails.findOne(query, options.projection, options);
  return bankDetails;
}

export async function getBankDetailsList(filter, options = {}) {
  const bankDetails = await BankDetails.find(filter, options.projection, options);
  return bankDetails;
}

export async function getBankDetailsListWithPagination(filter, options = {}) {
  const bankDetails = await BankDetails.paginate(filter, options);
  return bankDetails;
}

export async function createBankDetails(body = {}) {
  if (body.storeId) {
    const storeId = await Store.findOne({ _id: body.storeId });
    if (!storeId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field storeId is not valid');
    }
  }
  const bankDetails = await BankDetails.create(body);
  return bankDetails;
}

export async function updateBankDetails(filter, body, options = {}) {
  if (body.storeId) {
    const storeId = await Store.findOne({ _id: body.storeId });
    if (!storeId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'field storeId is not valid');
    }
  }
  const bankDetails = await BankDetails.findOneAndUpdate(filter, body, options);
  return bankDetails;
}

export async function updateManyBankDetails(filter, body, options = {}) {
  const bankDetails = await BankDetails.updateMany(filter, body, options);
  return bankDetails;
}

export async function removeBankDetails(filter) {
  const bankDetails = await BankDetails.findOneAndRemove(filter);
  return bankDetails;
}

export async function removeManyBankDetails(filter) {
  const bankDetails = await BankDetails.deleteMany(filter);
  return bankDetails;
}

export async function aggregateBankDetails(query) {
  const bankDetails = await BankDetails.aggregate(query);
  return bankDetails;
}

// export async function aggregateBankDetailsWithPagination(query, options = {}) {
//   const aggregate = BankDetails.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const bankDetails = await BankDetails.aggregatePaginate(aggregate, options);
//   return bankDetails;
// }
