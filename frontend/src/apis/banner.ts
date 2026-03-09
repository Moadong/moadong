import API_BASE_URL from '@/constants/api';
import { handleResponse } from './utils/apiHelpers';

export type BannerType = 'WEB' | 'APP_HOME' | 'WEB_MOBILE';

export interface Banner {
  id: string;
  imageUrl: string;
  linkTo: string | null;
  alt: string;
  [key: string]: unknown;
}

// Banner API
export const bannerApi = {
  getBanners: async (type: BannerType = 'WEB'): Promise<Banner[]> => {
    const url = new URL(`${API_BASE_URL}/api/banner`);
    url.searchParams.set('type', type);

    const response = await fetch(url);
    const data = await handleResponse<{
      statuscode: string;
      message: string;
      images: Banner[];
    }>(response, `배너 목록 조회 실패 : ${response.status}`);

    return data?.images ?? [];
  },
};
