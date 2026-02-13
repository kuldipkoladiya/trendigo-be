import Joi from 'joi';
import config from 'config/config';
import enumFields from 'models/enum.model';

Joi.objectId = require('joi-objectid')(Joi);

export const createStore = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),

    profileImage: Joi.string().regex(
      new RegExp(
        `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*.(png|jpg)$)`
      )
    ),

    // ✅ ADD THIS
    bannerImages: Joi.array().items(
      Joi.string().regex(
        new RegExp(
          `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*.(png|jpg)$)`
        )
      )
    ),

    aboutStore: Joi.string(),
    storeUrl: Joi.string(),
    businessCategoryId: Joi.objectId(),
    isDeclaration: Joi.bool(),
    descriptionValue: Joi.string(),
    settlementCycle: Joi.string().valid(...Object.values(enumFields.EnumSettlementCycleOfStore)),
  }),
};

export const updateStore = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),

    profileImage: Joi.string().regex(
      new RegExp(
        `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*.(png|jpg)$)`
      )
    ),

    // ✅ ADD THIS
    bannerImages: Joi.array().items(
      Joi.string().regex(
        new RegExp(
          `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*.(png|jpg)$)`
        )
      )
    ),

    aboutStore: Joi.string(),
    storeUrl: Joi.string(),
    businessCategoryId: Joi.objectId(),
    isDeclaration: Joi.bool(),
    descriptionValue: Joi.string(),
    settlementCycle: Joi.string().valid(...Object.values(enumFields.EnumSettlementCycleOfStore)),
  }),
};

export const getStoreById = {
  params: Joi.object().keys({
    storeId: Joi.objectId().required(),
  }),
};

export const deleteStoreById = {
  params: Joi.object().keys({
    storeId: Joi.objectId().required(),
  }),
};

export const getStore = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedStore = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};

export const StoreBySelleId = {
  params: Joi.object().keys({
    contact: Joi.objectId().required(),
  }),
};
