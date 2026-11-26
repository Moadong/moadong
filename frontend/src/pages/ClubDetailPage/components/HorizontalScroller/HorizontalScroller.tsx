// 가로로 넘기는 카드 목록에 양 끝 흐림과 (데스크톱) 화살표를 붙여 옆에 더 있다는 걸 알려주는 래퍼
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRightIcon } from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import * as Styled from './HorizontalScroller.styles';

// 한 번 누를 때 보이는 폭의 이만큼 넘긴다. 다음 카드 일부가 남아 이어 보인다
const SCROLL_PAGE_RATIO = 0.8;
// 스크롤 끝 판정 여유(px). 소수점 폭 때문에 끝에서도 1px쯤 남는다
const EDGE_TOLERANCE = 4;

interface HorizontalScrollerProps {
  /** 화살표 버튼 이름에 쓴다. 예: "1년 활동" */
  label: string;
  children: ReactNode;
}

const HorizontalScroller = ({ label, children }: HorizontalScrollerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > EDGE_TOLERANCE);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_TOLERANCE,
    );
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * SCROLL_PAGE_RATIO,
      behavior: 'smooth',
    });
  };

  return (
    <Styled.Wrapper>
      <Styled.Viewport ref={viewportRef} onScroll={updateEdges}>
        {children}
      </Styled.Viewport>

      <Styled.Fade $side='left' $visible={canScrollLeft} aria-hidden />
      <Styled.Fade $side='right' $visible={canScrollRight} aria-hidden />

      <Styled.ArrowButton
        type='button'
        $side='left'
        $visible={canScrollLeft}
        onClick={() => scrollByPage(-1)}
        aria-label={`${label} 이전 보기`}
        tabIndex={canScrollLeft ? 0 : -1}
      >
        <ChevronRightIcon width={18} height={18} />
      </Styled.ArrowButton>
      <Styled.ArrowButton
        type='button'
        $side='right'
        $visible={canScrollRight}
        onClick={() => scrollByPage(1)}
        aria-label={`${label} 다음 보기`}
        tabIndex={canScrollRight ? 0 : -1}
      >
        <ChevronRightIcon width={18} height={18} />
      </Styled.ArrowButton>
    </Styled.Wrapper>
  );
};

export default HorizontalScroller;
