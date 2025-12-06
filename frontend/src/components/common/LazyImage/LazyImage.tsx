import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  onError?: () => void;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  isEager?: boolean;
}

const LAZY_LOAD_ROOT_MARGIN = '50%';

const LazyImage = ({
  src,
  alt,
  onError,
  placeholder = '#f0f0f0',
  threshold = 0.01,
  rootMargin = LAZY_LOAD_ROOT_MARGIN,
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
        rootMargin,
      }
    );

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, isEager]);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: isLoaded ? 'transparent' : placeholder,
        transition: 'background-color 0.3s',
      }}
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onError={onError}
          onLoad={() => setIsLoaded(true)}
          loading={isEager ? 'eager' : 'lazy'}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;