import { getClubDetail } from '@/apis/getClubDetail';
import { useQuery } from '@tanstack/react-query';
import { ClubDetail } from '@/types/club';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';

export const useGetClubDetail = (clubId: string) => {
  return useQuery<ClubDetail>({
    queryKey: ['clubDetail', clubId],
    queryFn: () => getClubDetail(clubId as string),
    enabled: !!clubId,
    select: (data) =>
      ({
        ...data,
        logo: data.logo ? convertGoogleDriveUrl(data.logo) : undefined,
        feeds: Array.isArray(data.feeds)
          ? data.feeds.map(convertGoogleDriveUrl)
          : [],
      }) as ClubDetail,
  });
};
