// 소개 페이지 전용 헤더(로고·가운데 슬롯·메뉴)와 본문 칼럼 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Page = styled.div`
  min-height: 100dvh;
  background: ${colors.base.white};
`;

/* 모아동 메인 헤더와 높이·폭·로고·메뉴 글자를 맞춰, 오가도 헤더가 흔들리지 않게 한다 */
export const Header = styled.header<{ $isScrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 30;
  background: ${colors.base.white};
  box-shadow: ${({ $isScrolled }) =>
    $isScrolled ? '0px 2px 12px rgba(0, 0, 0, 0.04)' : 'none'};
  transition: box-shadow 0.2s ease-in-out;
`;

/* 로고 | 가운데 슬롯 | 메뉴. 가운데가 정확히 화면 중앙에 오도록 양옆 칸을 같은 비율로 둔다 */
export const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  max-width: 1180px;
  height: ${HEADER_HEIGHT.desktop}px;
  margin: 0 auto;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    height: ${HEADER_HEIGHT.tablet}px;
  }

  ${media.mobile} {
    height: ${HEADER_HEIGHT.mobile}px;
  }
`;

export const Start = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  a {
    display: block;
  }
`;

export const BackButton = styled.button`
  display: flex;
  margin-left: -6px;
  padding: 4px;
  border: none;
  background: none;
  color: ${colors.gray[900]};
  cursor: pointer;
`;

/* 메인 헤더와 같은 크기와 전환 폭(870px) */
export const Logo = styled.img`
  display: block;
  width: 152px;
  height: auto;

  @media (max-width: 870px) {
    display: none;
  }
`;

export const Mark = styled.img`
  display: none;
  width: 32px;
  height: auto;

  @media (max-width: 870px) {
    display: block;
  }
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export const CenterSlot = styled(motion.div)``;

export const End = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 45px;

  a {
    font-size: 14px;
    font-weight: 500;
    color: ${colors.gray[900]};
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    opacity: 0.7;
  }

  a[aria-current='page'] {
    color: ${colors.primary[900]};
  }

  ${media.laptop} {
    gap: 28px;
  }

  ${media.tablet} {
    display: none;
  }
`;

export const MenuButton = styled.button`
  display: none;
  margin-right: -6px;
  padding: 6px;
  border: none;
  background: none;
  color: ${colors.gray[900]};
  cursor: pointer;

  ${media.tablet} {
    display: flex;
  }
`;

/* 햄버거를 누르면 헤더 아래로 펼쳐지는 메뉴 목록 */
export const MobileMenu = styled(motion.nav)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 20px 16px;
  background: ${colors.base.white};
  box-shadow: 0 12px 24px rgba(17, 17, 17, 0.08);

  a {
    padding: 14px 0;
    font-size: 17px;
    font-weight: 600;
    color: ${colors.gray[900]};
    text-decoration: none;
  }

  a + a {
    border-top: 1px solid ${colors.gray[200]};
  }

  a[aria-current='page'] {
    color: ${colors.primary[900]};
  }

  ${media.tablet} {
    display: flex;
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
