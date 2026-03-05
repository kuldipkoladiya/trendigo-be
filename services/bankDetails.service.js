import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { BankDetails, Store } from 'models';
import axios from 'axios';

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

/**
 * Verify Bank Account using Cashfree
 */
export const verifyBankAccount = async (bankDetailsId, userId) => {
  try {
    const bank = await BankDetails.findById(bankDetailsId);

    if (!bank) {
      throw new Error('Bank details not found');
    }

    // Call Cashfree API
    const response = await axios.post(
      `${process.env.CASHFREE_BASE_URL}/validation/bankDetails`,
      {
        bank_account: bank.accountNumber.toString(),
        ifsc: bank.ifscCode,
      },
      {
        headers: {
          'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
          'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    /*
    success response example:

    {
      account_status: "VALID",
      account_holder_name: "Kuldeep Koladiya"
    }
    */

    if (result.account_status === 'VALID') {
      bank.isVerified = true;
      bank.updatedBy = userId;

      await bank.save();

      return {
        success: true,
        verified: true,
        accountHolderName: result.account_holder_name,
      };
    }

    return {
      success: true,
      verified: false,
    };
  } catch (error) {
    console.error('Bank verification error:', (error.response && error.response.data) || error.message);

    throw new Error('Bank verification failed');
  }
};
