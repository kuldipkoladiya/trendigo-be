import httpStatus from 'http-status';
import { catchAsync } from 'utils/catchAsync';
import { bannerService } from 'services';

export const createBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.createBanner(req.body, req.user);
  res.status(httpStatus.CREATED).send({ results: banner });
});

export const getBannerList = catchAsync(async (req, res) => {
  const banners = await bannerService.getBanners();
  res.status(httpStatus.OK).send({ results: banners });
});

export const updateBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.updateBanner(req.params.bannerId, req.body, req.user);
  res.status(httpStatus.OK).send({ results: banner });
});

export const deleteBanner = catchAsync(async (req, res) => {
  await bannerService.deleteBanner(req.params.bannerId, req.user);
  res.status(httpStatus.OK).send({ message: 'Banner deleted successfully' });
});
