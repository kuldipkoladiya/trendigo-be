import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import enumModel from 'models/enum.model';
import { toJSON, softDelete } from './plugins';

const StoreSchema = new mongoose.Schema(
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
    profileImage: {
      type: String,
    },
    aboutStore: {
      type: String,
    },
    storeUrl: {
      type: String,
    },
    businessCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessCategory',
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerUser',
    },
    isDeclaration: {
      type: Boolean,
      default: false,
    },
    /**
     * this is value that seller user declare we can move this into another mdel as well and take id of that here a ref
     * */
    descriptionValue: {
      type: String,
    },
    settlementCycle: {
      type: String,
      enum: Object.values(enumModel.EnumSettlementCycleOfStore),
      default: enumModel.EnumSettlementCycleOfStore.YEAR,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
StoreSchema.plugin(toJSON);
StoreSchema.plugin(mongoosePaginateV2);
StoreSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const StoreModel = mongoose.models.Store || mongoose.model('Store', StoreSchema, 'Store');
module.exports = StoreModel;
