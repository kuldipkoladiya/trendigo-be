import Joi from 'joi';
import config from 'config/config';

Joi.objectId = require('joi-objectid')(Joi);

export const createReview = {
  body: Joi.object().keys({
    userId: Joi.objectId(),
    productId: Joi.objectId(),
    sellerId: Joi.objectId(),
    title: Joi.string(),
    description: Joi.string(),
    rating: Joi.number(),
    isAdminAprove: Joi.bool(),
    productImages: Joi.array()
      .items(
        Joi.string().regex(
          new RegExp(
            `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*\\.(png|jpg|jpeg|webp)$)`
          )
        )
      )
      .default([]),
  }),
};

export const updateReview = {
  body: Joi.object().keys({
    userId: Joi.objectId(),
    productId: Joi.objectId(),
    sellerId: Joi.objectId(),
    title: Joi.string(),
    description: Joi.string(),
    rating: Joi.number(),
    isAdminAprove: Joi.bool(),
    productImages: Joi.array()
      .items(
        Joi.string().regex(
          new RegExp(
            `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*\\.(png|jpg|jpeg|webp)$)`
          )
        )
      )
      .default([]),
  }),
  params: Joi.object().keys({
    reviewId: Joi.objectId().required(),
  }),
};

export const getReviewById = {
  params: Joi.object().keys({
    reviewId: Joi.objectId().required(),
  }),
};

export const deleteReviewById = {
  params: Joi.object().keys({
    reviewId: Joi.objectId().required(),
  }),
};

export const getReview = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number(),
      limit: Joi.number(),
    })
    .unknown(true),
};

export const paginatedReview = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};

export const getReviewByproductId = {
  params: Joi.object().keys({
    productId: Joi.objectId().required(),
  }),
};

export const getReviewBysellerId = {
  params: Joi.object().keys({
    sellerId: Joi.objectId().required(),
  }),
};
export const getReviewByuserId = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};
