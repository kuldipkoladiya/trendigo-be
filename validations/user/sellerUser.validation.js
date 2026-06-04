import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createSellerUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.objectId(),
    isEmailVerified: Joi.bool(),
    mobileNumber: Joi.number().integer(),
    countryCodeId: Joi.objectId(),
    isMobileVerified: Joi.bool(),
  }),
};

export const updateSellerUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    role: Joi.objectId(),
    isEmailVerified: Joi.bool(),
    mobileNumber: Joi.number().integer(),
    countryCodeId: Joi.objectId(),
    isMobileVerified: Joi.bool(),
  }),
  params: Joi.object().keys({
    sellerUserId: Joi.objectId().required(),
  }),
};

export const getSellerUserById = {
  params: Joi.object().keys({
    sellerUserId: Joi.objectId().required(),
  }),
};

export const deleteSellerUserById = {
  params: Joi.object().keys({
    sellerUserId: Joi.objectId().required(),
  }),
};

export const getSellerUser = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedSellerUser = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
