import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as Styled from './PhotoEditTab.styles';
import ImageUpload from '@/pages/AdminPage/components/ImageUpload/ImageUpload';
import { ImagePreview } from '@/pages/AdminPage/components/ImagePreview/ImagePreview';
import useUpdateFeedImages from '@/hooks/queries/club/useUpdateFeedImages';

import { ClubDetail } from '@/types/club';
import { useQueryClient } from '@tanstack/react-query';

const MAX_IMAGES = 5;

const RecruitEditTab = () => {
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

  return (
    <Styled.RecruitEditorContainer>
      <Styled.InfoTitle>활동 사진 편집</Styled.InfoTitle>
      <Styled.ImageContainer>
        <Styled.ImageGrid>
          {imageList.map((image, index) => (
            <ImagePreview
              key={`${image}-${index}`}
              image={image}
              onDelete={() => deleteImage(index)}
            />
          ))}
          {imageList.length < MAX_IMAGES && (
            <ImageUpload
              key='add-image'
              onChangeImageList={addImage}
              clubId={clubDetail.id}
            />
          )}
        </Styled.ImageGrid>
      </Styled.ImageContainer>
    </Styled.RecruitEditorContainer>
  );
};
export default RecruitEditTab;
