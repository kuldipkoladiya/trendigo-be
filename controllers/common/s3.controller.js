import httpStatus from 'http-status';
import { catchAsync } from 'utils/catchAsync';
import { s3Service } from 'services';
// eslint-disable-next-line import/prefer-default-export
export const preSignedPutUrl = catchAsync(async (req, res) => {
  const { body, user } = req;
  const s3PutObject = await s3Service.validateExtensionForPutObject(body, user);
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const sellerSign = catchAsync(async (req, res) => {
  const { body, user } = req;
  const s3PutObject = await s3Service.validateExtensionForSellerPic(body, user, body.isProfilePic, body.isSellerSign);
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const UserProfilePic = catchAsync(async (req, res) => {
  const { body, user } = req;
  const s3PutObject = await s3Service.validateExtensionForProfilePic(body, user, body.isProfilePic, body.isSellerSign);
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const preSignedPutUrlv2 = catchAsync(async (req, res) => {
  const { body, user } = req;
  const s3PutObject = await s3Service.validateExtensionForPutObjectv2(body, user);
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});
