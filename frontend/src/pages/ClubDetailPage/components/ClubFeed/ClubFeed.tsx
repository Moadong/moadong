import { usePhotoModal } from '@/hooks/PhotoList/usePhotoModal';
import PhotoModal from '@/pages/clubDetailPage2/components/PhotoModal/PhotoModal';
import * as Styled from './ClubFeed.styles';

interface Props {
  photos: string[];
  clubName?: string;
}

export function ClubFeed({ photos, clubName = '동아리' }: Props) {
  const { isOpen, index, open, close, setIndex } = usePhotoModal();

  if (!photos || photos.length === 0) {
    return (
      <Styled.EmptyState>
        <Styled.EmptyText>등록된 활동사진이 없습니다</Styled.EmptyText>
      </Styled.EmptyState>
    );
  }

  return (
    <>
      <Styled.Container>
        <Styled.PhotoGrid>
          {photos.map((photo, index) => (
            <Styled.PhotoItem
              key={`${photo}-${index}`}
              onClick={() => open(index)}
            >
              <Styled.PhotoImage
                src={photo}
                alt={`활동사진 ${index + 1}`}
                loading='lazy'
              />
            </Styled.PhotoItem>
          ))}
        </Styled.PhotoGrid>
      </Styled.Container>

      <PhotoModal
        isOpen={isOpen}
        onClose={close}
        clubName={clubName}
        photos={{
          currentIndex: index,
          urls: photos,
          onChangeIndex: setIndex,
        }}
      />
    </>
  );
}
