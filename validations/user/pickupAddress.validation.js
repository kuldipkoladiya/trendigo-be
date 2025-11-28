import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createPickupAddress = {
  body: Joi.object().keys({
    storeId: Joi.objectId().required(),
    pincode: Joi.number().integer().required(),
    addressLineOne: Joi.string().required(),
    addessLineTwo: Joi.string(),
    landmark: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string(),
    shopNo: Joi.string(),
  }),
};

export const updatePickupAddress = {
  body: Joi.object().keys({
    storeId: Joi.objectId(),
    pincode: Joi.number().integer(),
    addressLineOne: Joi.string(),
    addessLineTwo: Joi.string(),
    landmark: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    shopNo: Joi.string(),
  }),
  params: Joi.object().keys({
    pickupAddressId: Joi.objectId().required(),
  }),
};

export const getPickupAddressById = {
  params: Joi.object().keys({
    pickupAddressId: Joi.objectId().required(),
  }),
};

export const deletePickupAddressById = {
  params: Joi.object().keys({
    pickupAddressId: Joi.objectId().required(),
  }),
};

export const getPickupAddress = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedPickupAddress = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
