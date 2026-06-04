import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';
import enumModel from './enum.model';

const accessSchema = new mongoose.Schema({
  view: { type: Boolean, default: false },
  add: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});

const SellerRoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(enumModel.EnumRoleOfSeller),
      default: enumModel.EnumRoleOfSeller.STAFF,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    products: accessSchema,
    orders: accessSchema,
    inventory: accessSchema,
    reviews: accessSchema,
    storeSettings: accessSchema,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Prevent duplicate role names within the same store
SellerRoleSchema.index({ role: 1, storeId: 1 }, { unique: true });

SellerRoleSchema.plugin(toJSON);
SellerRoleSchema.plugin(mongoosePaginateV2);

const SellerRoleModel = mongoose.models.SellerRole || mongoose.model('SellerRole', SellerRoleSchema, 'SellerRole');
module.exports = SellerRoleModel;
