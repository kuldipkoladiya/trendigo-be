import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';
import { ProductVariantKeyEnum, ProductVariantValueEnum } from './enum.model';

const ProductVarientByProductIdSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    /** Example: Color */
    variantKey: {
      type: String,
      enum: Object.values(ProductVariantKeyEnum),
      required: true,
    },

    /** Example: Red */
    variantValue: {
      type: String,
      enum: Object.values(ProductVariantValueEnum),
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
    },

    /** optional: variant image */
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'S3image',
    },
  },
  { timestamps: true }
);

ProductVarientByProductIdSchema.plugin(toJSON);
ProductVarientByProductIdSchema.plugin(mongoosePaginateV2);
ProductVarientByProductIdSchema.plugin(softDelete, {
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});

export default mongoose.models.ProductVarientByProductId ||
  mongoose.model('ProductVarientByProductId', ProductVarientByProductIdSchema);
