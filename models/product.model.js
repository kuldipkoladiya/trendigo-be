import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductSchema = new mongoose.Schema(
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
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType',
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    productCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategories',
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductBrand',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerUser',
    },
    productCode: {
      type: String,
    },
    sku: {
      type: String,
    },
    sellingPrice: {
      type: Number,
    },
    marketPrice: {
      type: String,
    },
    taxDetails: {
      type: String,
    },
    productDetails: {
      type: String,
    },
    variantsEnabled: {
      type: Boolean,
      default: false,
    },
    /**
     * // todo : make more clear about variant section
     * */
    variants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'ProductVarientByProductId',
    },
    tages: {
      type: [String],
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'S3image',
      },
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'S3image',
      },
    ],
    /**
     * This will be in percentage
     * */
    storeDiscount: {
      type: Number,
    },
    specifications: [
      {
        key: {
          type: String,
          trim: true,
        },
        value: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ProductSchema.plugin(toJSON);
ProductSchema.plugin(mongoosePaginateV2);
ProductSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'Product');
module.exports = ProductModel;
