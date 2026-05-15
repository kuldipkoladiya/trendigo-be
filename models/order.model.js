import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const OrderSchema = new mongoose.Schema(
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
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerUser',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    productDetailList: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        variants: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProductVarientByProductId',
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    grandTotal: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAddress',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
OrderSchema.plugin(toJSON);
OrderSchema.plugin(mongoosePaginateV2);
OrderSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'Order');
module.exports = OrderModel;
