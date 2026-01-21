import httpStatus from 'http-status';
import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { ProductCategories, ProductType } from '../../models';

export const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = {};
  const product = await productService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const getSellerProduct = catchAsync(async (req, res) => {
  const { sellerId } = req.params;
  const filter = {
    sellerId,
  };
  const options = {};
  const product = await productService.getProductList(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});
export const listProduct = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductList(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const paginateProduct = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const product = await productService.getProductListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const createProduct = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user._id;
  body.updatedBy = req.user._id;
  const options = {};
  const product = await productService.createProduct(body, options);
  return res.status(httpStatus.CREATED).send({ results: product });
});

export const updateProduct = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = { new: true };
  const product = await productService.updateProduct(filter, body, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const removeProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const product = await productService.removeProduct(filter);
  return res.status(httpStatus.OK).send({ results: product });
});

export const getProductsByProductType = catchAsync(async (req, res) => {
  const { productType } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const productTypeDoc = await ProductType.findOne({
    value: productType,
  });

  if (!productTypeDoc) {
    return res.status(404).send({
      status: 'Fail',
      message: 'Product type not found',
    });
  }

  const filter = {
    productTypeId: productTypeDoc._id, // ✅ correct
  };

  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 },
  };

  const products = await productService.getProductListPaginated(filter, options);

  return res.status(200).send({
    status: 'Success',
    results: products, // ✅ MUST send docs
    page: products.page,
    limit: products.limit,
    totalPages: products.totalPages,
    totalResults: products.totalDocs,
  });
});

export const getProductsByProductCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // 🔹 Step 1: find category by value
  const categoryDoc = await ProductCategories.findOne({
    value: category,
  });

  if (!categoryDoc) {
    return res.status(404).send({
      status: 'Fail',
      message: 'Product category not found',
    });
  }

  // 🔹 Step 2: filter products
  const filter = {
    productCategoryId: categoryDoc._id,
  };

  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 },
  };

  // 🔹 Step 3: paginated products
  const products = await productService.getProductListPaginated(filter, options);

  return res.status(200).send({
    status: 'Success',
    results: products,
    page: products.page,
    limit: products.limit,
    totalPages: products.totalPages,
    totalResults: products.totalDocs,
  });
});
