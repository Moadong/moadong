import React, { useEffect, useRef, useState } from 'react';

const LazyImage = ({
  src,
  alt,
  onError,
}: {
  src: string;
  alt: string;
  onError?: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return isVisible ? (
    <img ref={imgRef} src={src} alt={alt} onError={onError} />
  ) : (
    <div ref={imgRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default LazyImage;
