import Joi from 'joi';
import { ProductVariantKeyEnum, ProductVariantValueEnum } from '../../models/enum.model';

Joi.objectId = require('joi-objectid')(Joi);

export const createProductVarientByProductId = {
  body: Joi.object({
    productId: Joi.objectId().required(),

    variantKey: Joi.string()
      .valid(...Object.values(ProductVariantKeyEnum))
      .required(),

    variantValue: Joi.string()
      .valid(...Object.values(ProductVariantValueEnum))
      .required(),

    quantity: Joi.number().integer().min(0).required(),

    price: Joi.number().positive().required(),

    discount: Joi.number().min(0).default(0),

    sku: Joi.string().trim(),

    image: Joi.objectId().optional(),
  }),
};

export const updateProductVarientByProductId = {
  params: Joi.object({
    productVarientByProductIdId: Joi.objectId().required(),
  }),

  body: Joi.object({
    productId: Joi.objectId().optional(),

    variantKey: Joi.string()
      .valid(...Object.values(ProductVariantKeyEnum))
      .optional(),

    variantValue: Joi.string()
      .valid(...Object.values(ProductVariantValueEnum))
      .optional(),

    quantity: Joi.number().integer().min(0).optional(),

    price: Joi.number().positive().optional(),

    discount: Joi.number().min(0).optional(),

    sku: Joi.string().trim().optional(),

    image: Joi.objectId().optional(),
  }).min(1), // at least one field required
};

export const getProductVarientByProductIdById = {
  params: Joi.object().keys({
    productVarientByProductIdId: Joi.objectId().required(),
  }),
};

export const deleteProductVarientByProductIdById = {
  params: Joi.object().keys({
    productVarientByProductIdId: Joi.objectId().required(),
  }),
};

export const getProductVarientByProductId = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedProductVarientByProductId = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};

export const getVarientByProductId = {
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};
