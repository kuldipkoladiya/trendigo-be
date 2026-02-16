import Joi from 'joi';

export const register = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      businessName: Joi.string().required(),
      email: Joi.string().email(),
      mobileNumber: Joi.number(),
      countryCodeId: Joi.string().optional(),
    })
    .or('email', 'mobileNumber'),
};

export const sendOtp = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      mobileNumber: Joi.number(),
    })
    .xor('email', 'mobileNumber'),
};

export const verifyOtp = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      mobileNumber: Joi.number(),
      otp: Joi.number().integer().required(),
    })
    .or('email', 'mobileNumber'),
};

export const login = {
  body: Joi.object()
    .keys({
      countryCodeId: Joi.objectId().when('mobileNumber', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      email: Joi.string().email(),
      mobileNumber: Joi.number(),
      password: Joi.string().required(),
      deviceToken: Joi.string().allow(''),
    })
    .or('email', 'mobileNumber'),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const updateSellerEmailAndMobile = {
  body: Joi.object().keys({
    email: Joi.object().keys({
      currentEmail: Joi.string().email().required(),
      newEmail: Joi.string().email().required(),
    }),
    mobileNumber: Joi.object().keys({
      currentMobileNumber: Joi.number().required(),
      newMobileNumber: Joi.number().required(),
    }),
  }),
};

export const verifySellerEmailAndMobile = {
  body: Joi.object().keys({
    email: Joi.object().keys({
      currentEmail: Joi.string().email().required(),
      newEmail: Joi.string().email().required(),
      otp: Joi.number().required(),
    }),
    mobileNumber: Joi.object().keys({
      currentMobileNumber: Joi.number().required(),
      newMobileNumber: Joi.number().required(),
      otp: Joi.number().required(),
    }),
  }),
};
