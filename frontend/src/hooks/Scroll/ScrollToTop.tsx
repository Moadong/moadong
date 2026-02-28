import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollTo } from './useScrollTo';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { scrollToTop } = useScrollTo();

  useEffect(() => {
    scrollToTop();
  }, [pathname, scrollToTop]);

  return null;
};
