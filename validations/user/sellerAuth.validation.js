import Joi from 'joi';

export const register = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      businessName: Joi.string().required(),
      email: Joi.string().email(),
      mobileNumber: Joi.number(),
      countryCode: Joi.string().optional(),
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
      email: Joi.string().email(),
      mobileNumber: Joi.number(),
      password: Joi.string().required(),
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
