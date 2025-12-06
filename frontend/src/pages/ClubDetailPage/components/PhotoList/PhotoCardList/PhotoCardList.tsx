import * as Styled from '../PhotoList.styles';
import LazyImage from '@/pages/ClubDetailPage/components/PhotoList/LazyImage/LazyImage';

interface PhotoCardListProps {
  photoUrls: string[];
  imageErrors: Record<number, boolean>;
  onImageClick: (index: number) => void;
  onImageError: (index: number) => void;
}

const IMAGE_EAGER_LOADING_COUNT = 4;

const PhotoCardList = ({
  photoUrls,
  imageErrors,
  onImageClick,
  onImageError,
}: PhotoCardListProps) => {
  return (
    <>
      {photoUrls.map((url, index) => (
        <Styled.PhotoCard key={index} onClick={() => onImageClick(index)}>
          {!imageErrors[index] ? (
            <LazyImage
              src={url}
              alt={`활동 사진 ${index + 1}`}
              onError={() => onImageError(index)}
              isEager={index < IMAGE_EAGER_LOADING_COUNT}
            />
          ) : (
            <Styled.NoImageContainer>이미지 준비중..</Styled.NoImageContainer>
          )}
        </Styled.PhotoCard>
      ))}
    </>
  );
};

export default PhotoCardList;
