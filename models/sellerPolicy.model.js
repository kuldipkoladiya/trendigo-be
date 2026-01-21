import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const OtherPolicyForStoreSchema = new mongoose.Schema({
  key: {
    type: String,
  },
  value: {
    type: String,
  },
});
const SellerPolicySchema = new mongoose.Schema(
  {
    /**
     * created By
     * */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * updated By
     * */
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    privacy: {
      type: [String],
    },
    returnPolicy: {
      type: [String],
    },
    shipping: {
      type: [String],
    },
    other: {
      type: OtherPolicyForStoreSchema,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
SellerPolicySchema.plugin(toJSON);
SellerPolicySchema.plugin(mongoosePaginateV2);
SellerPolicySchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const SellerPolicyModel = mongoose.models.SellerPolicy || mongoose.model('SellerPolicy', SellerPolicySchema, 'SellerPolicy');
module.exports = SellerPolicyModel;
