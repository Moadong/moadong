import { useEffect, useRef, useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import ArrowButton from '../PromotionArrowButton/PromotionArrowButton';
import * as Styled from './PromotionImageGallery.styles';

interface PromotionImageGalleryProps {
  images: string[];
  promotionId: string;
}

const MAX_HEIGHT = 700;

const PromotionImageGallery = ({
  images,
  promotionId,
}: PromotionImageGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackEvent = useMixpanelTrack();
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

  const handleToggleExpanded = () => {
    const nextExpanded = !expanded;
    trackEvent(USER_EVENT.PROMOTION_IMAGE_MORE_CLICKED, {
      promotion_id: promotionId,
      expanded: nextExpanded,
      image_count: images.length,
    });
    setExpanded(nextExpanded);
  };

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
            onClick={handleToggleExpanded}
          />
        </Styled.ImageMoreButtonWrapper>
      )}
    </Styled.Wrapper>
  );
};

export default PromotionImageGallery;
