import { PointerEvent, useState } from 'react';
import { useTheme } from 'styled-components';
import moadongLogo from '@/assets/images/logos/moadong_mobile_logo.svg';
import { PeaceType } from '../../data/peaceTypes';
import { CARD_IMAGES } from './cardImages';
import * as Styled from './ResultCard.styles';

const MAX_TILT_DEG = 10;

const BLOBS = [
  { size: 160, x: '-12%', y: '8%', duration: 7 },
  { size: 90, x: '70%', y: '30%', duration: 5 },
  { size: 120, x: '55%', y: '62%', duration: 9 },
];

interface ResultCardProps {
  type: PeaceType;
}

const ResultCard = ({ type }: ResultCardProps) => {
  const theme = useTheme();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const image = CARD_IMAGES[type.id];
  const bg = theme.colors.secondary[type.colorIndex].main;

  // 터치는 스크롤 제스처와 겹치므로 기울기 연출은 마우스에서만 한다.
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <Styled.Perspective>
      <Styled.Flip
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Styled.Card
          data-testid='result-card'
          $bg={bg}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          onPointerUp={resetTilt}
        >
          <Styled.Decor data-testid='result-card-decor' aria-hidden>
            {BLOBS.map((blob) => (
              <Styled.Blob
                key={blob.x + blob.y}
                $size={blob.size}
                $x={blob.x}
                $y={blob.y}
                animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
                transition={{
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </Styled.Decor>
          {image ? (
            <Styled.Image src={image} alt={`${type.name} 카드`} />
          ) : (
            <Styled.Symbol aria-hidden>{type.symbol}</Styled.Symbol>
          )}
          <Styled.Scrim data-testid='result-card-scrim' aria-hidden />
          <Styled.Logo src={moadongLogo} alt='모아동' />
          <Styled.TextBlock>
            <Styled.Name>{type.name}</Styled.Name>
            <Styled.Catchphrase>{type.catchphrase}</Styled.Catchphrase>
          </Styled.TextBlock>
        </Styled.Card>
      </Styled.Flip>
    </Styled.Perspective>
  );
};

export default ResultCard;
