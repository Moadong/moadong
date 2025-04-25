import { useRef, useCallback } from 'react';

/**
 * 섹션 자동 스크롤을 위한 커스텀 훅
 * @param sectionCount - 섹션의 총 개수
 * @param yOffset - 스크롤 시 상단 여백 (기본값: -110)
 * @returns {Object} sectionRefs와 scrollToSection 함수를 포함한 객체
 */
const useAutoScroll = (sectionCount: number = 4, yOffset: number = -110) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(sectionCount).fill(null),
  );

  /**
   * 지정된 인덱스의 섹션으로 스크롤
   * @param index - 스크롤할 섹션의 인덱스
   * @returns {boolean} 스크롤 성공 여부
   */
  const scrollToSection = useCallback(
    (index: number): boolean => {
      if (index < 0 || index >= sectionCount) {
        return false;
      }

      const element = sectionRefs.current[index];

      if (!element) {
        return false;
      }

      try {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY + yOffset,
          behavior: 'smooth',
        });
        return true;
      } catch (error) {
        console.error('Error scrolling to section:', error);
        return false;
      }
    },
    [sectionCount, yOffset],
  );

  return { sectionRefs, scrollToSection };
};

export default useAutoScroll;
