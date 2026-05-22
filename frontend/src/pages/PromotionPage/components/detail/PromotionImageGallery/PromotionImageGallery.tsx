import { useEffect, useRef, useState } from 'react';
import ArrowButton from '../PromotionArrowButton/PromotionArrowButton';
import * as Styled from './PromotionImageGallery.styles';

interface PromotionImageGalleryProps {
  images: string[];
}

const MAX_HEIGHT = 700;

const PromotionImageGallery = ({ images }: PromotionImageGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;

      const height = containerRef.current.scrollHeight;
      setShowButton(height > MAX_HEIGHT);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [images]);

  return (
    <Styled.Wrapper>
      <Styled.ImageContainer ref={containerRef} $expanded={expanded}>
        {images.map((src, idx) => (
          <Styled.Image key={idx} src={src} alt='promotion' />
        ))}

        {!expanded && showButton && <Styled.Gradient />}
      </Styled.ImageContainer>

      {showButton && (
        <Styled.ImageMoreButtonWrapper>
          <ArrowButton
            text={expanded ? '이미지 접기' : '이미지 더보기'}
            direction={expanded ? 'up' : 'down'}
            onClick={() => setExpanded((prev) => !prev)}
          />
        </Styled.ImageMoreButtonWrapper>
      )}
    </Styled.Wrapper>
  );
};

export default PromotionImageGallery;
