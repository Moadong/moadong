import createFeedImage from '@/apis/createFeedImage';
import { useMutation } from '@tanstack/react-query';

export const useCreateFeedImage = ({
  onSuccess,
}: {
  onSuccess: (data: string) => void;
}) => {
  return useMutation({
    mutationFn: ({ file, clubId }: { file: File; clubId: string }) =>
      createFeedImage(file, clubId),
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useCreateFeedImage;