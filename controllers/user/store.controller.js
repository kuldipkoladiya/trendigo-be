import httpStatus from 'http-status';
import { s3Service, storeService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import FileFieldValidationEnum from 'models/fileFieldValidation.model';
import mongoose from 'mongoose';
import TempS3 from 'models/tempS3.model';
import { asyncForEach } from 'utils/common';
import { SellerUser } from '../../models';

const moveFileAndUpdateTempS3 = async ({ url, newFilePath }) => {
  const newUrl = await s3Service.moveFile({ key: url, newFilePath });
  await TempS3.findOneAndUpdate({ url }, { url: newUrl });
  return newUrl;
};
// this is used to move file to new specified path as shown in basePath, used in create and update controller.
const moveFiles = async ({ body, user, moveFileObj }) => {
  await asyncForEach(Object.keys(moveFileObj), async (key) => {
    const fieldValidation = FileFieldValidationEnum[`${key}OfStore`];
    const basePath = `users/${user._id}/store/${body._id}/${key}/${mongoose.Types.ObjectId()}/`;
    if (Array.isArray(moveFileObj[key])) {
      const newUrlsArray = [];
      moveFileObj[key].map(async (ele) => {
        const filePath = `${mongoose.Types.ObjectId()}_${ele.split('/').pop()}`;
        newUrlsArray.push(moveFileAndUpdateTempS3({ url: ele, newFilePath: basePath + filePath }));
      });
      Object.assign(body, { ...body, [key]: await Promise.all(newUrlsArray) });
    } else {
      const filePath = `${mongoose.Types.ObjectId()}_${moveFileObj[key].split('/').pop()}`;
      Object.assign(body, {
        ...body,
        [key]: await moveFileAndUpdateTempS3({
          url: moveFileObj[key],
          newFilePath: basePath + filePath,
        }),
      });
      if (fieldValidation.generateThumbnails) {
        Object.assign(body, {
          ...body,
          [`thumbOf${key}`]: await s3Service.createThumbnails({
            url: moveFileObj[key],
            resolutions: fieldValidation.thumbnailResolutions,
          }),
        });
      }
    }
  });
};
export const getStore = catchAsync(async (req, res) => {
  const { contact } = req.params;
  const filter = {
    contact,
  };
  const options = {};
  const store = await storeService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: store });
});

export const listStore = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const store = await storeService.getStoreList(filter, options);
  return res.status(httpStatus.OK).send({ results: store });
});

export const paginateStore = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const store = await storeService.getStoreListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: store });
});

export const createStore = catchAsync(async (req, res) => {
  const { body } = req;
  const { user } = req;

  body.createdBy = user._id;
  body.updatedBy = user._id;

  // ✅ SET CONTACT FROM AUTH SELLER
  body.contact = user._id;

  const moveFileObj = {
    ...(body.profileImage && { profileImage: body.profileImage }),
  };

  body._id = mongoose.Types.ObjectId();

  await moveFiles({ body, user, moveFileObj });

  const storeResult = await storeService.createStore(body);
  if (storeResult && storeResult._id) {
    await SellerUser.findByIdAndUpdate(
      user._id,
      {
        storeId: storeResult._id,
        updatedBy: user._id,
      },
      { new: true }
    );
  }
  if (storeResult && storeResult.profileImage) {
    await TempS3.updateMany({ url: storeResult.profileImage }, { active: true });
  }
  return res.status(httpStatus.CREATED).send({ results: storeResult });
});

export const updateStore = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { storeId } = req.params;
  const { user } = req;
  const moveFileObj = {
    ...(body.profileImage && { profileImage: body.profileImage }),
  };
  body._id = storeId;
  await moveFiles({ body, user, moveFileObj });
  const filter = {
    _id: storeId,
  };
  const options = { new: true };
  const storeResult = await storeService.updateStore(filter, body, options);
  // tempS3
  if (storeResult) {
    const uploadedFileUrls = [];
    uploadedFileUrls.push(storeResult.profileImage);
    await TempS3.updateMany({ url: { $in: uploadedFileUrls } }, { active: true });
  }
  return res.status(httpStatus.OK).send({ results: storeResult });
});

export const removeStore = catchAsync(async (req, res) => {
  const { storeId } = req.params;
  const filter = {
    _id: storeId,
  };
  const store = await storeService.removeStore(filter);
  return res.status(httpStatus.OK).send({ results: store });
});
