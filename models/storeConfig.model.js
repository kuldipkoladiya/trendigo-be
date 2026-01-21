import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const StoreConfigSchema = new mongoose.Schema(
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
    banner: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
StoreConfigSchema.plugin(toJSON);
StoreConfigSchema.plugin(mongoosePaginateV2);
StoreConfigSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const StoreConfigModel = mongoose.models.StoreConfig || mongoose.model('StoreConfig', StoreConfigSchema, 'StoreConfig');
module.exports = StoreConfigModel;
