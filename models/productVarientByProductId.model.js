import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductVarientByProductIdSchema = new mongoose.Schema(
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
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    /**
     * // todo : make 0 to detuld value and update value here
     * */
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ProductVarientByProductIdSchema.plugin(toJSON);
ProductVarientByProductIdSchema.plugin(mongoosePaginateV2);
ProductVarientByProductIdSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ProductVarientByProductIdModel =
  mongoose.models.ProductVarientByProductId ||
  mongoose.model('ProductVarientByProductId', ProductVarientByProductIdSchema, 'ProductVarientByProductId');
module.exports = ProductVarientByProductIdModel;
