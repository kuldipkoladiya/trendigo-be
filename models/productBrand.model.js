import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductBrandSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ProductBrandSchema.plugin(toJSON);
ProductBrandSchema.plugin(mongoosePaginateV2);
ProductBrandSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ProductBrandModel = mongoose.models.ProductBrand || mongoose.model('ProductBrand', ProductBrandSchema, 'ProductBrand');
module.exports = ProductBrandModel;
