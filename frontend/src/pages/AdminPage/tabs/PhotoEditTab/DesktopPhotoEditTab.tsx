import React from 'react';
import * as Styled from './PhotoEditTab.styles';
import ImageUpload from './components/ImageUpload/ImageUpload';
import { ImagePreview } from './components/ImagePreview/ImagePreview';
import { ClubDetail } from '@/types/club';
import { ADMIN_EVENT } from '@/constants/eventName';

interface PhotoEditTabProps {
  clubDetail: ClubDetail;
  imageList: string[];
  addImage: (newImage: string) => void;
  deleteImage: (index: number) => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const DesktopPhotoEditTab = ({
  clubDetail,
  imageList,
  addImage,
  deleteImage,
  trackEvent,
}: PhotoEditTabProps) => {
  return (
    <Styled.PhotoEditorContainer>
      <Styled.InfoTitle>활동 사진 편집</Styled.InfoTitle>
      <Styled.Label>활동사진 추가 (최대 5장)</Styled.Label>
      <Styled.ImageContainer>
        <ImageUpload
          key='add-image'
          onChangeImageList={addImage}
          clubId={clubDetail.id}
          imageCount={imageList.length}
        />
        <br />
        <Styled.Label>활동사진 수정</Styled.Label>
        <Styled.ImageGrid>
          {imageList.map((image, index) => (
            <ImagePreview
              key={`${image}-${index}`}
              image={image}
              onDelete={() => {
                trackEvent(ADMIN_EVENT.IMAGE_DELETE_BUTTON_CLICKED);
                deleteImage(index);
              }}
            />
          ))}
        </Styled.ImageGrid>
      </Styled.ImageContainer>
    </Styled.PhotoEditorContainer>
  );
};

export default DesktopPhotoEditTab;
