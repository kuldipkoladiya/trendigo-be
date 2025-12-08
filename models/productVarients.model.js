import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductVarientsSchema = new mongoose.Schema(
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
    productCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategories',
    },
    key: {
      type: String,
    },
    /**
     * // todo : we need to give mixed type to popar values based on current ecomarce
     * */
    value: {
      type: mongoose.Mixed,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ProductVarientsSchema.plugin(toJSON);
ProductVarientsSchema.plugin(mongoosePaginateV2);
ProductVarientsSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ProductVarientsModel =
  mongoose.models.ProductVarients || mongoose.model('ProductVarients', ProductVarientsSchema, 'ProductVarients');
module.exports = ProductVarientsModel;
