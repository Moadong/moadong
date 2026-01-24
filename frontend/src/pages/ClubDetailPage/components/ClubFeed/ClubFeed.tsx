import { useEffect, useState } from 'react';
import PhotoModal from '@/pages/ClubDetailPage/components/PhotoModal/PhotoModal';
import * as Styled from './ClubFeed.styles';
import useDevice from '@/hooks/useDevice';

const DESKTOP_EAGER_IMAGE_COUNT = 15;
const MOBILE_EAGER_IMAGE_COUNT = 6;

interface Props {
  feed: string[];
  clubName?: string;
}

const ClubFeed = ({ feed, clubName = '동아리' }: Props) => {
  const { isLaptop, isDesktop } = useDevice();

  const loadingThreshold = isDesktop || isLaptop 
    ? DESKTOP_EAGER_IMAGE_COUNT
    : MOBILE_EAGER_IMAGE_COUNT;

  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!feed || feed.length === 0) {
      setIsOpen(false);
      setIndex(0);
    } else if (index >= feed.length) {
      setIndex(feed.length - 1);
    }
  }, [feed, index]);

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
                loading={index < loadingThreshold ? 'eager' : 'lazy'}
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
