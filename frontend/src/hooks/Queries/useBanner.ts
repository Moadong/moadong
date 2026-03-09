import { useQuery } from '@tanstack/react-query';
import { Banner, bannerApi, BannerType } from '@/apis/banner';
import { queryKeys } from '@/constants/queryKeys';

export const useGetBanners = (type: BannerType = 'WEB') => {
  return useQuery<Banner[]>({
    queryKey: queryKeys.banner.list(type),
    queryFn: () => bannerApi.getBanners(type),
    staleTime: 60 * 1000,
  });
};
