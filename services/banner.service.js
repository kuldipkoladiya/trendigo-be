import { Banner } from 'models';
import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';

export const createBanner = async (body, user) => {
  if (!body.images || body.images.length !== 4) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Exactly 4 images required');
  }

  return Banner.create({
    ...body,
    createdBy: user._id,
    updatedBy: user._id,
  });
};

export const getBanners = async () => {
  return Banner.find({ isActive: true }).populate('images').sort({ createdAt: -1 });
};

export const updateBanner = async (bannerId, body, user) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }

  Object.assign(banner, body, { updatedBy: user._id });
  return banner.save();
};

export const deleteBanner = async (bannerId, user) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }

  banner.isDeleted = true;
  banner.deletedBy = user._id;
  banner.deletedAt = new Date();
  return banner.save();
};
