// 상세 최상단에 커버·활동사진을 모자이크로 보여주고 눌러서 크게 보는 영역
import { SyntheticEvent, useState } from 'react';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import PhotoModal from '@/pages/ClubDetailPage/components/PhotoModal/PhotoModal';
import { TAG_COLORS } from '@/styles/clubTags';
import cdnImage, { fallbackToOriginal } from '@/utils/cdnImage';
import * as Styled from './ClubPhotoHero.styles';

// 데스크톱 모자이크는 큰 사진 1장 + 작은 사진 4장
const MAX_TILES = 5;

interface ClubPhotoHeroProps {
  clubName: string;
  logo?: string;
  cover?: string;
  feeds: string[];
  category?: string;
}

const ClubPhotoHero = ({
  clubName,
  logo,
  cover,
  feeds,
  category,
}: ClubPhotoHeroProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // 원본까지 깨진 사진은 모자이크에서 뺀다
  const [brokenPhotos, setBrokenPhotos] = useState<Set<string>>(
    () => new Set(),
  );
  const photos = [cover, ...feeds].filter(
    (url): url is string => !!url && !brokenPhotos.has(url),
  );

  const handleError =
    (url: string) => (event: SyntheticEvent<HTMLImageElement>) => {
      if (event.currentTarget.getAttribute('src') === url) {
        setBrokenPhotos((prev) => new Set(prev).add(url));
        return;
      }
      fallbackToOriginal(url)(event);
    };

  if (photos.length === 0) {
    return (
      <Styled.Fallback
        $color={(category && TAG_COLORS[category]) || undefined}
        aria-hidden
      >
        <Styled.FallbackLogo
          src={cdnImage(logo || DefaultLogo, 'logo')}
          onError={fallbackToOriginal(logo || DefaultLogo)}
          alt=''
        />
      </Styled.Fallback>
    );
  }

  const tiles = photos.slice(0, MAX_TILES);
  const hiddenCount = photos.length - tiles.length;

  return (
    <>
      <Styled.Mosaic $count={tiles.length}>
        {tiles.map((url, index) => {
          const isLastTile = index === tiles.length - 1;
          return (
            <Styled.Tile
              key={`${url}-${index}`}
              type='button'
              $index={index}
              onClick={() => setOpenIndex(index)}
              aria-label={`${clubName} 사진 ${index + 1} 크게 보기`}
            >
              <Styled.TileImage
                src={cdnImage(url, index === 0 ? 'cover' : 'grid')}
                onError={handleError(url)}
                alt=''
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {isLastTile && hiddenCount > 0 && (
                <Styled.MoreOverlay>+{hiddenCount}</Styled.MoreOverlay>
              )}
            </Styled.Tile>
          );
        })}
        <Styled.PhotoCount aria-hidden>사진 {photos.length}</Styled.PhotoCount>
      </Styled.Mosaic>

      <PhotoModal
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        clubName={clubName}
        photos={{
          currentIndex: openIndex ?? 0,
          urls: photos,
          onChangeIndex: setOpenIndex,
        }}
      />
    </>
  );
};

export default ClubPhotoHero;
