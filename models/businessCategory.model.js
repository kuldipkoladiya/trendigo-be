import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const BusinessCategorySchema = new mongoose.Schema(
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
    value: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
BusinessCategorySchema.plugin(toJSON);
BusinessCategorySchema.plugin(mongoosePaginateV2);
BusinessCategorySchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const BusinessCategoryModel =
  mongoose.models.BusinessCategory || mongoose.model('BusinessCategory', BusinessCategorySchema, 'BusinessCategory');
module.exports = BusinessCategoryModel;
