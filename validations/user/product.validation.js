import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createProduct = {
  body: Joi.object({
    createdBy: Joi.objectId().optional(),
    updatedBy: Joi.objectId().optional(),

    productTypeId: Joi.objectId().optional(),
    storeId: Joi.objectId().optional(),
    sellerId: Joi.objectId().optional(),
    productCategoryId: Joi.objectId().optional(),
    brandId: Joi.objectId().optional(),

    title: Joi.string().trim().required(),
    description: Joi.string().allow('').optional(),
    productDetails: Joi.string().allow('').optional(),
    taxDetails: Joi.string().trim().optional(),
    sellingPrice: Joi.number().min(0).optional(),
    marketPrice: Joi.number().min(0).optional(),
    storeDiscount: Joi.number().min(0).max(100).optional(),

    productCode: Joi.string().trim().optional(),
    sku: Joi.string().trim().optional(),

    variantsEnabled: Joi.boolean().default(false),

    variants: Joi.array().items(Joi.objectId()).optional(),

    specifications: Joi.array()
      .items(
        Joi.object({
          key: Joi.string().trim(),
          value: Joi.string().trim(),
        })
      )
      .optional(),

    images: Joi.array().items(Joi.objectId()).optional(),
    videos: Joi.array().items(Joi.objectId()).optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
  }),
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = {
  params: Joi.object({
    productId: Joi.objectId().required(),
  }),

  body: Joi.object({
    updatedBy: Joi.objectId().optional(),

    productTypeId: Joi.objectId().optional(),
    storeId: Joi.objectId().optional(),
    sellerId: Joi.objectId().optional(),
    productCategoryId: Joi.objectId().optional(),
    brandId: Joi.objectId().optional(),

    title: Joi.string().trim().optional(),
    description: Joi.string().allow('').optional(),
    productDetails: Joi.string().allow('').optional(),
    taxDetails: Joi.string().trim().optional(),
    sellingPrice: Joi.number().min(0).optional(),
    marketPrice: Joi.number().min(0).optional(),
    storeDiscount: Joi.number().min(0).max(100).optional(),

    productCode: Joi.string().trim().optional(),
    sku: Joi.string().trim().optional(),

    variantsEnabled: Joi.boolean().optional(),

    variants: Joi.array().items(Joi.objectId()).optional(),

    specifications: Joi.array()
      .items(
        Joi.object({
          key: Joi.string().trim(),
          value: Joi.string().trim(),
        })
      )
      .optional(),

    images: Joi.array().items(Joi.objectId()).optional(),
    videos: Joi.array().items(Joi.objectId()).optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
  }).min(1),
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

export const getSellerProduct = {
  params: Joi.object().keys({
    sellerId: Joi.objectId().required(),
  }),
};
