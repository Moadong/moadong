import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

// 데스크톱 오른쪽 정보 카드 폭
const ASIDE_WIDTH = 340;
const ASIDE_WIDTH_NARROW = 280;

/* ── LegacyClubDetailPage가 함께 쓰는 스타일 ─────────────────────────── */

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  ${media.tablet} {
    padding-bottom: 60px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  margin-top: 100px;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    flex-direction: column;
    padding: 0;
    gap: 0;
    max-width: 100%;
    margin-top: 0;
  }
`;

export const RightSection = styled.div`
  width: 100%;

  ${media.tablet} {
    border-top: 6px solid ${colors.gray[200]};
    padding-top: 12px;
  }
`;

export const AppSpacer = styled.div`
  height: calc(71px + env(safe-area-inset-bottom));

  ${media.tablet} {
    height: calc(87px + env(safe-area-inset-bottom));
  }
`;

export const TabContent = styled.div`
  animation: fadeIn ${transitions.duration.normal}
    ${transitions.easing.easeInOut};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ── 상세페이지 ──────────────────────────────────────────────────────── */

export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: ${HEADER_HEIGHT.desktop + 24}px;
  background-color: ${colors.base.white};

  ${media.tablet} {
    padding-top: 0;
    padding-bottom: 60px;
  }
`;

export const Inner = styled.div`
  max-width: 1180px;
  margin: 0 auto;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    padding: 0;
  }
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${ASIDE_WIDTH}px;
  gap: 48px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr) ${ASIDE_WIDTH_NARROW}px;
    gap: 28px;
  }

  ${media.tablet} {
    display: block;
  }
`;

export const Main = styled.div`
  min-width: 0;
`;

export const Aside = styled.aside`
  position: sticky;
  top: ${HEADER_HEIGHT.desktop + 24}px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
`;

export const Divider = styled.div`
  height: 8px;
  background-color: ${colors.gray[200]};
`;

export const TabArea = styled.div`
  margin-top: 28px;

  ${media.tablet} {
    margin-top: 0;
  }
`;

// 데스크톱에서는 헤더 아래에 붙어 따라오고, 모바일은 TopBar가 대신 탭을 띄운다
export const TabsWrapper = styled.div<{ $hidden: boolean }>`
  position: sticky;
  top: ${HEADER_HEIGHT.desktop}px;
  z-index: 2;
  padding-top: 8px;
  background-color: ${colors.base.white};
  box-shadow: inset 0 -1px 0 ${colors.gray[300]};
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};

  button {
    padding-bottom: 12px;
  }

  ${media.tablet} {
    position: static;
    padding-top: 14px;
    box-shadow: none;

    button {
      padding-bottom: 10px;
    }
  }
`;

export const MapCard = styled.button`
  display: block;
  width: 100%;
  height: 180px;
  padding: 0;
  border: 1px solid ${colors.gray[300]};
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  background-color: ${colors.gray[200]};

  * {
    cursor: pointer !important;
  }

  ${media.tablet} {
    height: 160px;
    border-radius: 16px;
  }
`;

export const MapCaption = styled.p`
  margin-top: 8px;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};
`;

export const ErrorMessage = styled.p`
  padding: 160px 20px;
  text-align: center;
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[700]};
`;
