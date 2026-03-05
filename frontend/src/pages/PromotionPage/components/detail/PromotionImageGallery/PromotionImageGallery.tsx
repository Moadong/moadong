import { useEffect, useRef, useState } from 'react';
import ImageMoreButton from './ImageMoreButton/ImageMoreButton';
import * as Styled from './PromotionImageGallery.styles';

interface PromotionImageGalleryProps {
  images: string[];
}

const testImages = [
  'https://picsum.photos/800/900',
  'https://picsum.photos/800/1000',
  'https://picsum.photos/800/1100',
];

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
  }, [testImages]);

  return (
    <Styled.Wrapper>
      <Styled.ImageContainer ref={containerRef} $expanded={expanded}>
        {testImages.map((src, idx) => (
          <Styled.Image key={idx} src={src} alt='promotion' />
        ))}

        {!expanded && showButton && <Styled.Gradient />}
      </Styled.ImageContainer>

      {showButton && (
        <Styled.ImageMoreButtonWrapper>
          <ImageMoreButton
            expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          />
        </Styled.ImageMoreButtonWrapper>
      )}
    </Styled.Wrapper>
  );
};

export default PromotionImageGallery;
