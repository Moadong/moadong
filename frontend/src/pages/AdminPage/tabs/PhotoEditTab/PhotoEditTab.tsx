import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useUpdateFeedImages from '@/hooks/queries/club/useUpdateFeedImages';
import { ClubDetail } from '@/types/club';
import { useQueryClient } from '@tanstack/react-query';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/useTrackPageView';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopPhotoEditTab from './DesktopPhotoEditTab';
import MobilePhotoEditTab from './MobilePhotoEditTab';

const MAX_IMAGES = 5;

const PhotoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.PHOTO_EDIT_PAGE);
  const isMobile = useIsMobileView();

  const clubDetail = useOutletContext<ClubDetail>();

  const { mutate: updateFeedImages } = useUpdateFeedImages();
  const [imageList, setImageList] = useState<string[]>([]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!clubDetail) return;

    setImageList(clubDetail.feeds || []);
  }, [clubDetail]);

  const addImage = (newImage: string) => {
    setImageList((prev) => {
      const updatedList = [...prev, newImage];

      updateFeedImages(
        {
          feeds: updatedList,
          clubId: clubDetail.id,
        },
        {
          onSuccess: () => {
            alert('이미지가 성공적으로 추가되었습니다.');
            queryClient.invalidateQueries({
              queryKey: ['clubDetail', clubDetail.id],
            });
          },
          onError: (error) => {
            alert(`이미지 추가에 실패했습니다: ${error.message}`);
          },
        },
      );

      return updatedList;
    });
  };

  const deleteImage = (index: number) => {
    const newList = imageList.filter((_, i) => i !== index);
    updateFeedImages(
      {
        feeds: newList,
        clubId: clubDetail.id,
      },
      {
        onSuccess: () => {
          alert('이미지가 성공적으로 삭제되었습니다.');
          setImageList(newList);
          queryClient.invalidateQueries({
            queryKey: ['clubDetail', clubDetail.id],
          });
        },
        onError: (error) => {
          alert(`이미지 삭제에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  const props = {
    clubDetail,
    imageList,
    addImage,
    deleteImage,
    trackEvent,
  };

  return isMobile ? (
    <MobilePhotoEditTab {...props} />
  ) : (
    <DesktopPhotoEditTab {...props} />
  );
};
export default PhotoEditTab;
