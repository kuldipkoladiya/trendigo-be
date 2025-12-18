import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createProduct = {
  body: Joi.object().keys({
    productTypeId: Joi.objectId(),
    storeId: Joi.objectId(),
    sellerId: Joi.objectId(),
    title: Joi.string().required(),
    description: Joi.string(),
    productCategoyId: Joi.objectId(),
    brandId: Joi.objectId(),
    productCode: Joi.string(),
    sku: Joi.string(),
    sellingPrice: Joi.number(),
    marketPrice: Joi.string(),
    productDetails: Joi.string(),
    variants: Joi.array().items(Joi.objectId()),
    tages: Joi.array().items(Joi.string()),
    storeDiscount: Joi.number().integer(),
  }),
};

export const updateProduct = {
  body: Joi.object().keys({
    productTypeId: Joi.objectId(),
    storeId: Joi.objectId(),
    title: Joi.string(),
    description: Joi.string(),
    productCategoyId: Joi.objectId(),
    brandId: Joi.objectId(),
    productCode: Joi.string(),
    sku: Joi.string(),
    sellingPrice: Joi.number(),
    marketPrice: Joi.string(),
    productDetails: Joi.string(),
    variants: Joi.array().items(Joi.objectId()),
    tages: Joi.array().items(Joi.string()),
    storeDiscount: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const getProductById = {
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const deleteProductById = {
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const getProduct = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedProduct = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
