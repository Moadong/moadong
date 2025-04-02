import updateFeedImages from '@/apis/updateFeedImages';
import { useMutation } from '@tanstack/react-query';

export const useUpdateFeedImages = () => {
  return useMutation({
    mutationFn: ({ feeds, clubId }: { feeds: string[]; clubId: string }) =>
      updateFeedImages(feeds, clubId),
  });
};

export default useUpdateFeedImages;
