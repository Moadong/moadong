import { useEffect, useRef, useState } from 'react';
import * as Styled from './LazyImage.styles';

interface LazyImageProps {
  src: string;
  alt: string;
  onError?: () => void;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  isEager?: boolean;
}

const LazyImage = ({
  src,
  alt,
  onError,
  placeholder = '#f0f0f0',
  threshold = 0.01,
  isEager = false,
}: LazyImageProps) => {
  const [isVisible, setIsVisible] = useState(isEager);
  const [isLoaded, setIsLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isEager) return;
    if (!rootRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
      }
    );

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [threshold, isEager]);

  return (
    <Styled.ImageContainer ref={rootRef} $isLoaded={isLoaded} $placeholder={placeholder}>
      {isVisible && (
        <Styled.StyledImage
          src={src}
          alt={alt}
          onError={onError}
          onLoad={() => setIsLoaded(true)}
          loading={isEager ? 'eager' : 'lazy'}
          $isLoaded={isLoaded}
        />
      )}
    </Styled.ImageContainer>
  );
};

export default LazyImage;