import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductCategoriesSchema = new mongoose.Schema(
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
      required: true,
    },
    isSubCategory: {
      type: Boolean,
      default: false,
    },
    /**
     * this will be id if product category model id and this will come only if isSubCategory is true
     * */
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategories',
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ProductCategoriesSchema.plugin(toJSON);
ProductCategoriesSchema.plugin(mongoosePaginateV2);
ProductCategoriesSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ProductCategoriesModel =
  mongoose.models.ProductCategories || mongoose.model('ProductCategories', ProductCategoriesSchema, 'ProductCategories');
module.exports = ProductCategoriesModel;
