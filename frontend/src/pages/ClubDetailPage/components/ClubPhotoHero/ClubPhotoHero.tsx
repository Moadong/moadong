// 상세 최상단에 커버·활동사진을 모자이크로 보여주고 눌러서 크게 보는 영역. 사진을 보는 유일한 입구다
import { SyntheticEvent, useState } from 'react';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import PhotoModal from '@/pages/ClubDetailPage/components/PhotoModal/PhotoModal';
import { TAG_COLORS } from '@/styles/clubTags';
import cdnImage, { fallbackToOriginal } from '@/utils/cdnImage';
import * as Styled from './ClubPhotoHero.styles';

// 큰 사진 1장 + 작은 사진 최대 4장
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

  const [main, ...rest] = photos.slice(0, MAX_TILES);
  const sideTiles = rest;
  const hiddenCount = photos.length - 1 - sideTiles.length;

  const renderTile = (url: string, index: number, isLast: boolean) => (
    <Styled.Tile
      key={`${url}-${index}`}
      type='button'
      onClick={() => setOpenIndex(index)}
      aria-label={`${clubName} 사진 ${index + 1} 크게 보기`}
    >
      <Styled.TileImage
        src={cdnImage(url, index === 0 ? 'cover' : 'grid')}
        onError={handleError(url)}
        alt=''
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      {isLast && hiddenCount > 0 && (
        <Styled.MoreOverlay>+{hiddenCount}</Styled.MoreOverlay>
      )}
    </Styled.Tile>
  );

  return (
    <>
      {/* 큰 사진은 본문 칸, 작은 사진 묶음은 아래 지원 카드 칸과 같은 폭·간격으로 나눈다 */}
      <Styled.Mosaic $hasSide={sideTiles.length > 0}>
        {renderTile(main, 0, false)}
        {sideTiles.length > 0 && (
          <Styled.Side $count={sideTiles.length}>
            {sideTiles.map((url, i) =>
              renderTile(url, i + 1, i === sideTiles.length - 1),
            )}
          </Styled.Side>
        )}
        <Styled.PhotoCount type='button' onClick={() => setOpenIndex(0)}>
          사진 {photos.length}장 모두 보기
        </Styled.PhotoCount>
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
