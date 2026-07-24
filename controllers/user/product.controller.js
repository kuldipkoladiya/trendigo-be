import httpStatus from 'http-status';
import { productService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { ProductCategories, ProductType, User } from '../../models';

export const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const filter = {
    _id: productId,
  };
  const options = {};
  const product = await productService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: product });
});

export const getSellerProductSummary = catchAsync(async (req, res) => {
  const { sellerId } = req.params;
  const filter = {
    sellerId,
  };
  const product = await productService.getProductListSummary(filter);
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
export const getStoreProduct = catchAsync(async (req, res) => {
  const { storeId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;

  const userId = req.user && req.user._id ? req.user._id : null;

  const response = await productService.getStoreProductListWithReviews(storeId, page, limit, userId);

  return res.status(200).json({
    status: 'Success',
    ...response,
  });
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
    // eslint-disable-next-line security/detect-non-literal-regexp
    value: { $regex: new RegExp(`^${productType}$`, 'i') },
  }).select('_id');

  if (!productTypeDoc) {
    return res.status(404).send({
      status: 'Fail',
      message: 'Product type not found',
    });
  }

  const filter = {
    productTypeId: productTypeDoc._id,
  };

  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { createdAt: -1 },
  };

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

export const getProductsByProductCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // 🔹 Step 1: find category by value (case-insensitive)
  const categoryDoc = await ProductCategories.findOne({
    // eslint-disable-next-line security/detect-non-literal-regexp
    value: { $regex: new RegExp(`^${category}$`, 'i') },
  }).select('_id');

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

export const listProductByReview = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // optional auth
  const userId = req.user && req.user._id ? req.user._id : null;

  const response = await productService.getProductListByReviewWithPagination(page, limit, userId);
  return res.status(200).json(response);
});
export const getProductDetails = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const userId = req.user && req.user._id ? req.user._id : null;

  const product = await productService.getProductDetailsById(productId, userId);

  return res.status(200).json({ results: product });
});

export const searchProducts = catchAsync(async (req, res) => {
  const userId = req.user && req.user._id ? req.user._id : null;

  const { keyword, categoryId, brandId, storeId, sellerId, page, limit, sortBy } = req.query;

  const result = await productService.searchProducts(
    {
      keyword,
      categoryId,
      brandId,
      storeId,
      sellerId,
      page,
      limit,
      sortBy,
    },
    userId
  );

  return res.status(200).json({
    success: true,
    results: result,
  });
});

export const searchSuggestions = catchAsync(async (req, res) => {
  const { keyword } = req.query;

  const result = await productService.searchSuggestions(keyword);

  return res.status(200).json({
    success: true,
    results: result,
  });
});

export const getRecentSearches = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('recentSearches');

  return res.status(200).json({
    results: user && user.recentSearches ? user.recentSearches : [],
  });
});
