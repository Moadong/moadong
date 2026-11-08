// 소개 페이지들(서비스 소개·업데이트 기록·만드는 사람들) 공통 틀: 모아동 메인 헤더 대신 쓰는 전용 헤더와 푸터
import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import moadongMark from '@/assets/images/logos/moadong_mobile_logo.svg';
import moadongLogo from '@/assets/images/moadong_name_logo.svg';
import Footer from '@/components/common/Footer/Footer';
import isInAppWebView from '@/utils/isInAppWebView';
import { SUBPAGE_NAV } from '../subpageNav';
import * as Styled from './SubpageLayout.styles';

interface SubpageLayoutProps {
  children: ReactNode;
  /** 헤더 가운데에 띄울 요소 (좁은 화면에서는 메뉴가 햄버거로 접혀 자리가 남는다) */
  center?: ReactNode;
  /** 본문 폭 제한 없이 그린다 (서비스 소개처럼 섹션이 화면 전체를 쓰는 페이지) */
  fullWidth?: boolean;
}

const BackIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width='22'
    height='22'
    fill='none'
    aria-hidden='true'
  >
    <path
      d='m15 5-7 7 7 7'
      stroke='currentColor'
      strokeWidth='2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox='0 0 24 24'
    width='24'
    height='24'
    fill='none'
    aria-hidden='true'
  >
    <path
      d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'}
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

const SubpageLayout = ({
  children,
  center,
  fullWidth = false,
}: SubpageLayoutProps) => {
  const navigate = useNavigate();
  const inWebView = isInAppWebView();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  // 메인 헤더처럼 내려가면 아래에 옅은 그림자를 깐다
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Styled.Page>
      <Styled.Header $isScrolled={isScrolled}>
        <Styled.HeaderInner>
          <Styled.Start>
            {/* 앱에서는 브라우저 뒤로가기가 없어 직접 둔다 */}
            {inWebView && (
              <Styled.BackButton
                type='button'
                aria-label='뒤로 가기'
                onClick={() =>
                  window.history.length > 1 ? navigate(-1) : navigate('/')
                }
              >
                <BackIcon />
              </Styled.BackButton>
            )}
            <Link to='/' aria-label='모아동 홈으로 가기'>
              <Styled.Logo src={moadongLogo} alt='' />
              <Styled.Mark src={moadongMark} alt='' />
            </Link>
          </Styled.Start>

          <Styled.Center>
            <AnimatePresence>
              {center && (
                <Styled.CenterSlot
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {center}
                </Styled.CenterSlot>
              )}
            </AnimatePresence>
          </Styled.Center>

          <Styled.End>
            <Styled.Nav aria-label='소개 메뉴'>
              {SUBPAGE_NAV.map(({ label, to }) => (
                <NavLink key={to} to={to} end>
                  {label}
                </NavLink>
              ))}
            </Styled.Nav>
            {/* 좁은 화면에서는 메뉴를 햄버거 안에 접어 둔다 */}
            <Styled.MenuButton
              type='button'
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
              aria-controls='introduce-mobile-menu'
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <MenuIcon open={menuOpen} />
            </Styled.MenuButton>
          </Styled.End>
        </Styled.HeaderInner>

        <AnimatePresence>
          {menuOpen && (
            <Styled.MobileMenu
              id='introduce-mobile-menu'
              aria-label='소개 메뉴'
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {SUBPAGE_NAV.map(({ label, to }) => (
                // 다른 소개 페이지로 옮겨 가면 메뉴를 닫는다
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </Styled.MobileMenu>
          )}
        </AnimatePresence>
      </Styled.Header>

      {fullWidth ? children : <Styled.Main>{children}</Styled.Main>}
      {!inWebView && <Footer />}
    </Styled.Page>
  );
};

export default SubpageLayout;
