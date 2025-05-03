import React from 'react';
import * as Styled from '../PhotoList.styles';
import LazyImage from '@/components/common/LazyImage/LazyImage';

interface PhotoCardListProps {
  photoUrls: string[];
  photoCount: number;
  imageErrors: Record<number, boolean>;
  onImageClick: (index: number) => void;
  onImageError: (index: number) => void;
}

const PhotoCardList = ({
  photoUrls,
  photoCount,
  imageErrors,
  onImageClick,
  onImageError,
}: PhotoCardListProps) => {
  return (
    <>
      {photoUrls.map((url, index) => (
        <Styled.PhotoCard
          key={index}
          photoCount={photoCount}
          isPlaceholder={false}
          onClick={() => onImageClick(index)}>
          {!imageErrors[index] ? (
            <LazyImage
              src={url}
              alt={`활동 사진 ${index + 1}`}
              onError={() => onImageError(index)}
            />
          ) : (
            <Styled.NoImageContainer>이미지 준비중..</Styled.NoImageContainer>
          )}
        </Styled.PhotoCard>
      ))}
      <Styled.PhotoCard isPlaceholder photoCount={photoCount}>
        <Styled.ImagePlaceholder />
      </Styled.PhotoCard>
    </>
  );
};

export default PhotoCardList;
