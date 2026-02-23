import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createRecentlyViewed = {
  body: Joi.object().keys({
    productId: Joi.objectId(),
    userId: Joi.objectId(),
    time: Joi.date(),
  }),
};

export const updateRecentlyViewed = {
  body: Joi.object().keys({
    productId: Joi.objectId(),
    userId: Joi.objectId(),
    time: Joi.date(),
  }),
  params: Joi.object().keys({
    recentlyViewedId: Joi.objectId().required(),
  }),
};

export const getRecentlyViewedById = {
  params: Joi.object().keys({
    recentlyViewedId: Joi.objectId().required(),
  }),
};
export const getRecentlyViewedByUser = {
  params: Joi.object().keys({}),
};

export const deleteRecentlyViewedById = {
  params: Joi.object().keys({
    recentlyViewedId: Joi.objectId().required(),
  }),
};

export const getRecentlyViewed = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedRecentlyViewed = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
