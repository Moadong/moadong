import { useRef, useState, useEffect } from 'react';
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
    if (containerRef.current) {
      if (containerRef.current.scrollHeight > MAX_HEIGHT) {
        setShowButton(true);
      }
    }
  }, []);

  return (
    <Styled.Wrapper>
      <Styled.ImageContainer
        ref={containerRef}
        $expanded={expanded}
      >
        {images.map((src, idx) => (
          <Styled.Image key={idx} src={src} alt="promotion" />
        ))}

        {!expanded && showButton && <Styled.Gradient />}
      </Styled.ImageContainer>

      {showButton && (
        <Styled.MoreButton
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '접기 ▲' : '이미지 더보기 ▼'}
        </Styled.MoreButton>
      )}
    </Styled.Wrapper>
  );
};

export default PromotionImageGallery;