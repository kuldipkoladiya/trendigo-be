import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

const productDetailListEmbed = Joi.object().keys({
  productId: Joi.objectId().required(),
  variants: Joi.objectId().required(),
  quantity: Joi.number().integer().required(),
});
export const createCart = {
  body: Joi.object().keys({
    productDetailList: Joi.array().items(productDetailListEmbed).min(1).required(),

    deliveryPartnerDetails: Joi.object().unknown(true),

    deliveryAddress: Joi.objectId(),

    storeDiscount: Joi.objectId(),

    coupanDiscount: Joi.number().integer().min(0),

    userCoupanDiscount: Joi.objectId(),
  }),
};

export const updateCart = {
  body: Joi.object().keys({
    variants: Joi.objectId().required(),
    quantity: Joi.number().integer().min(0).required(),
    deliveryAddress: Joi.objectId(),
    deliveryPartnerDetails: Joi.object().unknown(true),
  }),
};

export const getCartById = {
  params: Joi.object().keys({
    cartId: Joi.objectId().required(),
  }),
};

export const deleteCartById = {
  params: Joi.object().keys({
    cartId: Joi.objectId().required(),
  }),
};

export const getCart = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedCart = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
