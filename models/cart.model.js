import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const ProductDetailsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variants: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVarientByProductId',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const CartSchema = new mongoose.Schema(
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
    productDetailList: {
      type: ProductDetailsSchema,
      required: true,
    },
    /**
     * // todo : this will be update in future
     * */
    deliveryPartnerDetails: {
      type: mongoose.Mixed,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAddress',
    },
    /**
     * //calculate total price based on this percentage todo : update this baed on fut. requiremnt
     * */
    storeDiscount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupan',
    },
    coupanDiscount: {
      type: Number,
    },
    userCoupanDiscount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserCoupan',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
CartSchema.plugin(toJSON);
CartSchema.plugin(mongoosePaginateV2);
CartSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const CartModel = mongoose.models.Cart || mongoose.model('Cart', CartSchema, 'Cart');
module.exports = CartModel;
