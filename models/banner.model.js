import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const BannerSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    title: {
      type: String,
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'S3image',
        required: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

BannerSchema.plugin(toJSON);
BannerSchema.plugin(mongoosePaginateV2);
BannerSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});

const BannerModel = mongoose.models.Banner || mongoose.model('Banner', BannerSchema, 'Banner');

export default BannerModel;
