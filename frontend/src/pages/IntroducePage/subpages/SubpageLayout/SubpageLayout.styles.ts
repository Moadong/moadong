// 소개 페이지 전용 헤더(로고·가운데 슬롯·메뉴)와 본문 칼럼 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const SUBPAGE_HEADER_HEIGHT = { desktop: 72, mobile: 56 } as const;

export const Page = styled.div`
  min-height: 100dvh;
  background: ${colors.base.white};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

/* 로고 | 가운데 슬롯 | 메뉴. 가운데가 정확히 화면 중앙에 오도록 양옆 칸을 같은 비율로 둔다 */
export const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  max-width: 1120px;
  height: ${SUBPAGE_HEADER_HEIGHT.desktop}px;
  margin: 0 auto;
  padding: 0 24px;

  ${media.tablet} {
    height: ${SUBPAGE_HEADER_HEIGHT.mobile}px;
    padding: 0 16px;
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

export const Logo = styled.img`
  display: block;
  height: 24px;

  ${media.tablet} {
    display: none;
  }
`;

export const Mark = styled.img`
  display: none;
  height: 28px;

  ${media.tablet} {
    display: block;
  }
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export const CenterSlot = styled(motion.div)``;

export const Nav = styled.nav<{ $hiddenOnNarrow: boolean }>`
  display: flex;
  justify-content: flex-end;
  gap: 24px;

  a {
    font-size: 15px;
    font-weight: 600;
    color: ${colors.gray[700]};
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  a:hover,
  a[aria-current='page'] {
    color: ${colors.gray[950]};
  }

  ${media.laptop} {
    gap: 18px;
  }

  /* 좁은 화면에서 가운데 슬롯이 떠 있으면 메뉴는 잠시 숨긴다 (맨 위로 올리면 다시 보인다) */
  ${media.tablet} {
    display: ${({ $hiddenOnNarrow }) => ($hiddenOnNarrow ? 'none' : 'flex')};
    gap: 12px;

    a {
      font-size: 13px;
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
