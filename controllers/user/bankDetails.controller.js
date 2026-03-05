import httpStatus from 'http-status';
import { bankDetailsService } from 'services';
import { catchAsync } from 'utils/catchAsync';

export const getBankDetails = catchAsync(async (req, res) => {
  const { bankDetailsId } = req.params;
  const filter = {
    _id: bankDetailsId,
  };
  const options = {};
  const bankDetails = await bankDetailsService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: bankDetails });
});

export const listBankDetails = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const bankDetails = await bankDetailsService.getBankDetailsList(filter, options);
  return res.status(httpStatus.OK).send({ results: bankDetails });
});

export const paginateBankDetails = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const bankDetails = await bankDetailsService.getBankDetailsListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: bankDetails });
});

export const createBankDetails = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const bankDetails = await bankDetailsService.createBankDetails(body, options);
  return res.status(httpStatus.CREATED).send({ results: bankDetails });
});

export const updateBankDetails = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { bankDetailsId } = req.params;
  const filter = {
    _id: bankDetailsId,
  };
  const options = { new: true };
  const bankDetails = await bankDetailsService.updateBankDetails(filter, body, options);
  return res.status(httpStatus.OK).send({ results: bankDetails });
});

export const removeBankDetails = catchAsync(async (req, res) => {
  const { bankDetailsId } = req.params;
  const filter = {
    _id: bankDetailsId,
  };
  const bankDetails = await bankDetailsService.removeBankDetails(filter);
  return res.status(httpStatus.OK).send({ results: bankDetails });
});

export const verifyBankAccountController = async (req, res) => {
  try {
    const { bankDetailsId } = req.body;

    const userId = req.user._id;

    const result = await bankDetailsService.verifyBankAccount(bankDetailsId, userId);

    return res.status(200).json({
      success: true,
      message: result.verified ? 'Bank account verified successfully' : 'Bank account invalid',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
