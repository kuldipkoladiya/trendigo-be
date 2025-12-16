import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createProductBrand = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

export const updateProductBrand = {
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
  }),
  params: Joi.object().keys({
    productBrandId: Joi.objectId().required(),
  }),
};

export const getProductBrandById = {
  params: Joi.object().keys({
    productBrandId: Joi.objectId().required(),
  }),
};

export const deleteProductBrandById = {
  params: Joi.object().keys({
    productBrandId: Joi.objectId().required(),
  }),
};

export const getProductBrand = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedProductBrand = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
