import { usePhotoModal } from '@/hooks/PhotoList/usePhotoModal';
import PhotoModal from '@/pages/ClubDetailPage/components/PhotoModal/PhotoModal';
import * as Styled from './ClubFeed.styles';

interface Props {
  feed: string[];
  clubName?: string;
}

const ClubFeed = ({ feed, clubName = '동아리' }: Props) => {
  const { isOpen, index, open, close, setIndex } = usePhotoModal();

  if (!feed || feed.length === 0) {
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
          {feed.map((f, index) => (
            <Styled.PhotoItem key={`${f}-${index}`} onClick={() => open(index)}>
              <Styled.PhotoImage
                src={f}
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
          urls: feed,
          onChangeIndex: setIndex,
        }}
      />
    </>
  );
};

export default ClubFeed;
