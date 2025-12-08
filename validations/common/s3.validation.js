import JoiImport from 'joi';
import joiObjectId from 'joi-objectid';
import enumFields from '../../models/enum.model';

// Extend Joi with objectId before using
const Joi = JoiImport.extend(joiObjectId(JoiImport));

export const preSignedPutUrl = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    contentType: Joi.string()
      .valid(...Object.values(enumFields.EnumContentType))
      .required(),
  }),
};

export const sellerSign = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    contentType: Joi.string().required(),
    profileType: Joi.string()
      .valid(...Object.values(enumFields.EnumOfImageTypes))
      .required(),
    isProfilePic: Joi.boolean(),
    isSellerSign: Joi.boolean(),
    isBusinessCover: Joi.boolean(),
    caption: Joi.string(),
  }),
};
