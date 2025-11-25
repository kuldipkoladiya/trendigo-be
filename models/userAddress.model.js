import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const UserAddressSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    addressLineOne: {
      type: String,
    },
    addressLineTwo: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    isDefaultAddress: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
UserAddressSchema.plugin(toJSON);
UserAddressSchema.plugin(mongoosePaginateV2);
UserAddressSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const UserAddressModel = mongoose.models.UserAddress || mongoose.model('UserAddress', UserAddressSchema, 'UserAddress');
module.exports = UserAddressModel;
