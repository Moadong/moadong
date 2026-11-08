// 소개 하위 페이지 공통 틀: 모아동 메인 헤더 대신 로고와 업데이트 기록·만드는 사람들 메뉴만 둔 전용 헤더
import { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import moadongLogo from '@/assets/images/moadong_name_logo.svg';
import Footer from '@/components/common/Footer/Footer';
import isInAppWebView from '@/utils/isInAppWebView';
import { SUBPAGE_NAV } from '../subpageNav';
import * as Styled from './SubpageLayout.styles';

interface SubpageLayoutProps {
  children: ReactNode;
}

const SubpageLayout = ({ children }: SubpageLayoutProps) => (
  <Styled.Page>
    <Styled.Header>
      <Styled.HeaderInner>
        <Link to='/introduce' aria-label='모아동 서비스 소개로 가기'>
          <Styled.Logo src={moadongLogo} alt='모아동' />
        </Link>
        <Styled.Nav aria-label='소개 메뉴'>
          {SUBPAGE_NAV.map(({ label, to }) => (
            <NavLink key={to} to={to} end>
              {label}
            </NavLink>
          ))}
        </Styled.Nav>
      </Styled.HeaderInner>
    </Styled.Header>
    <Styled.Main>{children}</Styled.Main>
    {!isInAppWebView() && <Footer />}
  </Styled.Page>
);

export default SubpageLayout;
