import Joi from 'joi';
import enumFields from '../../models/enum.model';

Joi.objectId = require('joi-objectid')(Joi);

const accessSchema = Joi.object({
  view: Joi.boolean().default(false),
  add: Joi.boolean().default(false),
  update: Joi.boolean().default(false),
  delete: Joi.boolean().default(false),
});

export const addRole = {
  body: Joi.object().keys({
    role: Joi.string()
      .valid(...Object.values(enumFields.EnumRoleOfSeller))
      .required(),
    products: accessSchema,
    orders: accessSchema,
    inventory: accessSchema,
    reviews: accessSchema,
    storeSettings: accessSchema,
  }),
};

export const updateRole = {
  body: Joi.object().keys({
    role: Joi.string().valid(...Object.values(enumFields.EnumRoleOfSeller)),
    products: accessSchema,
    orders: accessSchema,
    inventory: accessSchema,
    reviews: accessSchema,
    storeSettings: accessSchema,
  }),
  params: Joi.object().keys({
    roleId: Joi.objectId().required(),
  }),
};

export const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.objectId().required(),
  }),
};

export const getRoleById = {
  params: Joi.object().keys({
    roleId: Joi.objectId().required(),
  }),
};
