import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as Styled from './Banner.styles';
import { SlideButton } from '@/utils/banners';

export interface BannerProps {
  backgroundImage?: string;
}

interface BannerComponentProps {
  desktopBanners: BannerProps[];
  mobileBanners: BannerProps[];
}

const Banner = ({ desktopBanners, mobileBanners }: BannerComponentProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const banners = isMobile ? mobileBanners : desktopBanners;
  const extendedBanners = [banners[banners.length - 1], ...banners, banners[0]];

  const updateSlideWidth = useCallback(() => {
    if (slideRef.current) {
      setSlideWidth(slideRef.current.offsetWidth);
      slideRef.current.style.transform = `translateX(-${currentSlideIndex * slideRef.current.offsetWidth}px)`;
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
      updateSlideWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateSlideWidth]);

  useEffect(() => {
    if (!slideRef.current) return;

    if (isAnimating) {
      slideRef.current.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
    } else {
      if (currentSlideIndex === 1) {
        slideRef.current.style.transform = `translateX(-${slideWidth}px)`;
      } else if (currentSlideIndex === banners.length) {
        slideRef.current.style.transform = `translateX(-${banners.length * slideWidth}px)`;
      }
    }

    const transitionEndHandler = () => {
      if (currentSlideIndex === banners.length + 1) {
        setIsAnimating(false);
        setCurrentSlideIndex(1);
      } else if (currentSlideIndex === 0) {
        setIsAnimating(false);
        setCurrentSlideIndex(banners.length);
      }
      setIsTransitioning(false);
    };

    slideRef.current.addEventListener('transitionend', transitionEndHandler);
    return () => {
      slideRef.current?.removeEventListener(
        'transitionend',
        transitionEndHandler,
      );
    };
  }, [currentSlideIndex, slideWidth, banners.length, isAnimating]);

  const moveToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsAnimating(true);
    setCurrentSlideIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const moveToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsAnimating(true);
    setCurrentSlideIndex((prev) => prev - 1);
  }, [isTransitioning]);

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
          {extendedBanners.map((banner, index) => (
            <Styled.BannerItem key={index}>
              <img src={banner.backgroundImage} alt={`banner-${index}`} />
            </Styled.BannerItem>
          ))}
        </Styled.SlideWrapper>
      </Styled.BannerWrapper>
    </Styled.BannerContainer>
  );
};

export default Banner;
