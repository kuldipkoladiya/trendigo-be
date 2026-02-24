import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const BankDetailsSchema = new mongoose.Schema(
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
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
BankDetailsSchema.plugin(toJSON);
BankDetailsSchema.plugin(mongoosePaginateV2);
BankDetailsSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const BankDetailsModel = mongoose.models.BankDetails || mongoose.model('BankDetails', BankDetailsSchema, 'BankDetails');
module.exports = BankDetailsModel;
