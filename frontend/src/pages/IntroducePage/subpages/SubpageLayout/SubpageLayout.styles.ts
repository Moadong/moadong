// 소개 하위 페이지 전용 헤더(로고·메뉴)와 본문 칼럼 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Page = styled.div`
  min-height: 100vh;
  background: ${colors.base.white};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1040px;
  height: 72px;
  margin: 0 auto;
  padding: 0 24px;

  ${media.mobile} {
    height: 56px;
    padding: 0 16px;
  }
`;

export const Logo = styled.img`
  display: block;
  height: 24px;

  ${media.mobile} {
    height: 20px;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 24px;

  a {
    font-size: 15px;
    font-weight: 600;
    color: ${colors.gray[700]};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover,
  a[aria-current='page'] {
    color: ${colors.gray[950]};
  }

  ${media.mobile} {
    gap: 16px;

    a {
      font-size: 14px;
    }
  }
`;

export const Main = styled.main`
  max-width: 880px;
  margin: 0 auto;
  padding: 72px 24px 120px;

  ${media.mobile} {
    padding: 40px 20px 80px;
  }
`;
