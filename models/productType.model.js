import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductTypeSchema = new mongoose.Schema(
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
ProductTypeSchema.plugin(toJSON);
ProductTypeSchema.plugin(mongoosePaginateV2);
ProductTypeSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ProductTypeModel = mongoose.models.ProductType || mongoose.model('ProductType', ProductTypeSchema, 'ProductType');
module.exports = ProductTypeModel;
