import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const StoreAddressSchema = new mongoose.Schema(
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
    pincode: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    AddressLineOne: {
      type: String,
      required: true,
    },
    addessLineTwo: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
StoreAddressSchema.plugin(toJSON);
StoreAddressSchema.plugin(mongoosePaginateV2);
StoreAddressSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const StoreAddressModel = mongoose.models.StoreAddress || mongoose.model('StoreAddress', StoreAddressSchema, 'StoreAddress');
module.exports = StoreAddressModel;
