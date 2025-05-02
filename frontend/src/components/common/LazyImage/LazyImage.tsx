import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  onError?: () => void;
}

const LazyImage = ({ src, alt, onError }: LazyImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const delay = 100;
        timeout = setTimeout(() => {
          setIsVisible(true);
        }, delay);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

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
