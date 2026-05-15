import Joi from 'joi';

export const createRazorpayOrder = {
  body: Joi.object().keys({
    // optional: if we want to allow specifying a different cart, otherwise we use the user's active cart
    cartId: Joi.string().custom((value, helpers) => {
      if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"cartId" must be a valid mongo id');
      }
      return value;
    }),
  }),
};

export const verifyPayment = {
  body: Joi.object().keys({
    razorpayOrderId: Joi.string().required(),
    razorpayPaymentId: Joi.string().required(),
    razorpaySignature: Joi.string().required(),
  }),
};
