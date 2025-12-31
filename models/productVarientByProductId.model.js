import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductVarientByProductIdSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    variants: [
      {
        key: { type: String, required: true }, // Color, Size
        value: { type: String, required: true }, // Red, M
      },
    ],

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
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'S3image',
      },
    ],
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

const ProductVarientByProductId =
  mongoose.models.ProductVarientByProductId ||
  mongoose.model('ProductVarientByProductId', ProductVarientByProductIdSchema, 'ProductVarientByProductId');

export default ProductVarientByProductId;
