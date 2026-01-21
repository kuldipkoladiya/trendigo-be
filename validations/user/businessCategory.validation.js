import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createBusinessCategory = {
  body: Joi.object().keys({
    value: Joi.string().required(),
  }),
};

export const updateBusinessCategory = {
  body: Joi.object().keys({
    value: Joi.string(),
  }),
  params: Joi.object().keys({
    businessCategoryId: Joi.objectId().required(),
  }),
};

export const getBusinessCategoryById = {
  params: Joi.object().keys({
    businessCategoryId: Joi.objectId().required(),
  }),
};

export const deleteBusinessCategoryById = {
  params: Joi.object().keys({
    businessCategoryId: Joi.objectId().required(),
  }),
};

export const getBusinessCategory = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedBusinessCategory = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
