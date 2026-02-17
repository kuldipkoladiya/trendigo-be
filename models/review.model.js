import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ReviewSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerUser',
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      default: 4.5,
      max: 5,
    },
    isAdminAprove: {
      type: Boolean,
      default: false,
    },
    productImages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
ReviewSchema.plugin(toJSON);
ReviewSchema.plugin(mongoosePaginateV2);
ReviewSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema, 'Review');
module.exports = ReviewModel;
