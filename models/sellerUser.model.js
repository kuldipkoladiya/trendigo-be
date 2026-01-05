import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import bcrypt from 'bcryptjs';
import { toJSON, softDelete } from './plugins';
import enumModel from './enum.model';

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
  used: {
    type: Boolean,
  },
  codeType: {
    type: String,
    enum: Object.values(enumModel.EnumCodeTypeOfCode),
  },
});
const SellerImagesSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    name: {
      type: String,
    },
    isDeleted: Boolean,
    deleted: Boolean,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
const SellerUserSchema = new mongoose.Schema(
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
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      // eslint-disable-next-line security/detect-unsafe-regex
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: Number,
    },
    countryCode: {
      type: String,
    },
    isMobileVerifed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    codes: {
      type: [CodeSchema],
    },
    SellerSign: {
      type: String,
    },
    SellerSignImg: [SellerImagesSchema],
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
SellerUserSchema.plugin(toJSON);
SellerUserSchema.plugin(mongoosePaginateV2);
SellerUserSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
SellerUserSchema.pre('save', async function (next) {
  const User = this;
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 8);
  }
  next();
});

// * When user reset password or change password then it save in bcrypt format
SellerUserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate(); // {password: "..."}
  if (update && update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    this.setUpdate({
      $set: {
        password: passwordHash,
      },
    });
  }
  next();
});
SellerUserSchema.post(
  ['find', 'findOne', 'findOneAndDelete', 'findOneAndRemove', 'update', 'updateOne', 'updateMany'],
  function (result, next) {
    if (result && result.SellerSignImg && result.SellerSignImg.length) {
      // eslint-disable-next-line no-param-reassign
      result.SellerSignImg = result.SellerSignImg.filter((doc) => !doc.isDeleted);
    }

    // If you want to include deleted images, you can use a flag 'includeDeleted'
    if (!this._mongooseOptions.includeDeleted) {
      if (result && result.SellerSignImg && result.SellerSignImg.length) {
        // eslint-disable-next-line no-param-reassign
        result.SellerSignImg = result.SellerSignImg.filter((doc) => !doc.deleted);
      }
    }

    next(null, result);
  }
);
const SellerUserModel = mongoose.models.SellerUser || mongoose.model('SellerUser', SellerUserSchema, 'SellerUser');
module.exports = SellerUserModel;
