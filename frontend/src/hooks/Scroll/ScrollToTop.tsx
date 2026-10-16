import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollTo } from './useScrollTo';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { scrollToTop } = useScrollTo();

  useEffect(() => {
    // 경로 변경 시 즉시 이동(instant). smooth 프로그램 스크롤은
    // 모바일에서 fixed-bottom 바텀네비가 viewport와 어긋나는 글리치를 유발함
    scrollToTop('auto');
  }, [pathname, scrollToTop]);

  return null;
};
