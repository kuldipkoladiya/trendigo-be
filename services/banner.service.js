import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import Banner from '../models/banner.model';
import { S3image } from '../models';

/**
 * Get banner by id
 */
export async function getBannerById(id, options = {}) {
  const banner = await Banner.findById(id, options.projection, options).populate('images');
  return banner;
}

/**
 * Get single banner
 */
export async function getOne(query, options = {}) {
  const banner = await Banner.findOne(query, options.projection, options).populate('images');
  return banner;
}

/**
 * Get banner list
 */
export async function getBanners(filter = {}, options = {}) {
  const banners = await Banner.find(filter, options.projection, options).populate('images').sort({ createdAt: -1 });

  return banners;
}

/**
 * Get banner list with pagination
 */
export async function getBannerListWithPagination(filter = {}, options = {}) {
  const banners = await Banner.paginate(filter, {
    ...options,
    populate: 'images',
    sort: { createdAt: -1 },
  });

  return banners;
}

/**
 * Create banner
 */
export async function createBanner(body = {}, user) {
  if (!body.images || body.images.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Banner images are required');
  }

  // Optional: validate image ids
  const imageCount = await S3image.countDocuments({
    _id: { $in: body.images },
  });

  if (imageCount !== body.images.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid image id provided');
  }

  const banner = await Banner.create({
    ...body,
    createdBy: user._id,
    updatedBy: user._id,
  });

  return banner;
}

/**
 * Update banner
 */
export async function updateBanner(filter, body, user, options = {}) {
  const banner = await Banner.findOne(filter);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }

  Object.assign(banner, body, {
    updatedBy: user._id,
  });

  return banner.save(options);
}

/**
 * Update many banners
 */
export async function updateManyBanners(filter, body, options = {}) {
  const banners = await Banner.updateMany(filter, body, options);
  return banners;
}

/**
 * Remove single banner (soft delete)
 */
export async function removeBanner(filter, user) {
  const banner = await Banner.findOne(filter);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }

  banner.isDeleted = true;
  banner.deletedBy = user._id;
  banner.deletedAt = new Date();

  return banner.save();
}

/**
 * Remove many banners
 */
export async function removeManyBanners(filter) {
  const banners = await Banner.updateMany(filter, {
    isDeleted: true,
    deletedAt: new Date(),
  });

  return banners;
}

/**
 * Aggregate banners
 */
export async function aggregateBanner(query) {
  const banners = await Banner.aggregate(query);
  return banners;
}
