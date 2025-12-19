import httpStatus from 'http-status';
import { productCategoriesService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { ProductCategories } from '../../models';

export const getProductCategories = catchAsync(async (req, res) => {
  const { productCategoriesId } = req.params;
  const filter = {
    _id: productCategoriesId,
  };
  const options = {};
  const productCategories = await productCategoriesService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: productCategories });
});

export const listProductCategories = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const productCategories = await productCategoriesService.getProductCategoriesList(filter, options);
  return res.status(httpStatus.OK).send({ results: productCategories });
});

export const paginateProductCategories = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const productCategories = await productCategoriesService.getProductCategoriesListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: productCategories });
});

export const createProductCategories = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const productCategories = await productCategoriesService.createProductCategories(body, options);
  return res.status(httpStatus.CREATED).send({ results: productCategories });
});

export const updateProductCategories = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { productCategoriesId } = req.params;
  const filter = {
    _id: productCategoriesId,
  };
  const options = { new: true };
  const productCategories = await productCategoriesService.updateProductCategories(filter, body, options);
  return res.status(httpStatus.OK).send({ results: productCategories });
});

export const removeProductCategories = catchAsync(async (req, res) => {
  const { productCategoriesId } = req.params;
  const filter = {
    _id: productCategoriesId,
  };
  const productCategories = await productCategoriesService.removeProductCategories(filter);
  return res.status(httpStatus.OK).send({ results: productCategories });
});

export const getProductCategoriesList = catchAsync(async (req, res) => {
  const { parentCategoryId } = req.params;

  // const objectId = new mongoose.Types.ObjectId(parentCategoryId);

  const data = await ProductCategories.aggregate([
    {
      $match: {
        isSubCategory: true,
        $expr: {
          $eq: [{ $toString: '$parentCategoryId' }, parentCategoryId],
        },
      },
    },
  ]);

  return res.status(httpStatus.OK).send({
    status: 'Success',
    data,
  });
});
