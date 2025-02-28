import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as Styled from './Banner.styles';
import { SlideButton } from '@/utils/banners';

export interface BannerProps {
  backgroundImage?: string;
}

interface BannerComponentProps {
  banners: BannerProps[];
}

const Banner = ({ banners }: BannerComponentProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const updateSlideWidth = useCallback(() => {
    if (slideRef.current) {
      setSlideWidth(slideRef.current.offsetWidth);
      setIsAnimating(false);
      slideRef.current.style.transform = `translateX(-${currentSlideIndex * slideRef.current.offsetWidth}px)`;
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);

    return () => {
      window.removeEventListener('resize', updateSlideWidth);
    };
  }, [updateSlideWidth]);

  useEffect(() => {
    if (slideRef.current) {
      setIsAnimating(true);
      slideRef.current.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
    }
  }, [currentSlideIndex, slideWidth]);

  const moveToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const moveToPrevSlide = () => {
    setCurrentSlideIndex(
      (prev) => (prev - 1 + banners.length) % banners.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveToNextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [moveToNextSlide]);

  return (
    <Styled.BannerContainer>
      <Styled.BannerWrapper>
        <Styled.ButtonContainer>
          <Styled.SlideButton onClick={moveToPrevSlide}>
            <img src={SlideButton[0]} alt='Previous Slide' />
          </Styled.SlideButton>
          <Styled.SlideButton onClick={moveToNextSlide}>
            <img src={SlideButton[1]} alt='Next Slide' />
          </Styled.SlideButton>
        </Styled.ButtonContainer>
        <Styled.SlideWrapper ref={slideRef} isAnimating={isAnimating}>
          {banners.map((banner, index) => (
            <Styled.BannerItem key={index}>
              <img
                src={banner.backgroundImage}
                alt={`banner-${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Styled.BannerItem>
          ))}
        </Styled.SlideWrapper>
      </Styled.BannerWrapper>
    </Styled.BannerContainer>
  );
};

export default Banner;
