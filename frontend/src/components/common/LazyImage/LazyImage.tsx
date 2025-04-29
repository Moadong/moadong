import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  onError?: () => void;
}

const LazyImage = ({ src, alt, onError }: LazyImageProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const delay = 200;
        const timeout = setTimeout(() => {
          setShouldLoad(true);
        }, delay);
        observer.disconnect();

        return () => clearTimeout(timeout);
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad) {
      setIsVisible(true);
    }
  }, [shouldLoad]);

  return isVisible ? (
    <img ref={imgRef} src={src} alt={alt} onError={onError} />
  ) : (
    <div
      ref={imgRef}
      data-testid='lazy-image-placeholder'
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
      }}
    />
  );
};

export default LazyImage;
