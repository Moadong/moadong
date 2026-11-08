// 소개 페이지들(서비스 소개·업데이트 기록·만드는 사람들) 공통 틀: 모아동 메인 헤더 대신 쓰는 전용 헤더와 푸터
import { ReactNode } from 'react';
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
  /** 헤더 가운데에 띄울 요소. 있으면 좁은 화면에서는 메뉴 대신 이것을 보여 준다 */
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

const SubpageLayout = ({
  children,
  center,
  fullWidth = false,
}: SubpageLayoutProps) => {
  const navigate = useNavigate();
  const inWebView = isInAppWebView();

  return (
    <Styled.Page>
      <Styled.Header>
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

          <Styled.Nav aria-label='소개 메뉴' $hiddenOnNarrow={!!center}>
            {SUBPAGE_NAV.map(({ label, to }) => (
              <NavLink key={to} to={to} end>
                {label}
              </NavLink>
            ))}
          </Styled.Nav>
        </Styled.HeaderInner>
      </Styled.Header>

      {fullWidth ? children : <Styled.Main>{children}</Styled.Main>}
      {!inWebView && <Footer />}
    </Styled.Page>
  );
};

export default SubpageLayout;
