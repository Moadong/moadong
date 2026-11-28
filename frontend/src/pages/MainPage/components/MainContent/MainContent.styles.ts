import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { STUCK_CHIP_BAR_HEIGHT } from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList.styles';
import { media } from '@/styles/mediaQuery';

/** 모바일보다 넓은 화면에서 목록 앵커를 헤더 아래로 더 띄우는 여유 */
const LIST_ANCHOR_GAP = 12;

/**
 * 필터칩이 담당하던 고정 헤더 여백을 대신한다.
 * 데스크톱은 배너가 자체 margin-top으로 헤더를 피하므로 모바일에서만 필요하다.
 */
export const HeaderSpacer = styled.div`
  display: none;

  ${media.mobile} {
    display: block;
    height: ${HEADER_HEIGHT.mobile}px;
  }
`;

export const PageContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.mobile} {
    padding: 0 20px;
  }

  ${media.mini_mobile} {
    padding: 0 10px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  margin-bottom: 60px;
`;

/** 화면에는 안 보이고 스크린리더·검색엔진에만 읽히는 페이지 제목 */
export const VisuallyHiddenTitle = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

/**
 * 분과 선택 후 스크롤할 목록 시작점. 높이는 0이고, scroll-margin-top으로 고정 영역(헤더, 모바일은 칩 줄까지)만큼 띄운다.
 * MainContent는 이 값을 읽어 "목록 안쪽까지 내려와 있는지"도 판정한다.
 */
export const ListAnchor = styled.div`
  height: 0;
  scroll-margin-top: ${HEADER_HEIGHT.desktop + LIST_ANCHOR_GAP}px;

  ${media.tablet} {
    scroll-margin-top: ${HEADER_HEIGHT.tablet + LIST_ANCHOR_GAP}px;
  }

  ${media.mobile} {
    scroll-margin-top: ${HEADER_HEIGHT.mobile + STUCK_CHIP_BAR_HEIGHT}px;
  }
`;

/**
 * 목록 구간. 두 번째 구간(모집 마감)부터는 위에 띠를 깔아 모집 중 구간과 끊는다.
 * 모바일은 화면 끝까지 닿는 8px 띠, 그보다 넓으면 여백만 둔다.
 */
export const Section = styled.section`
  & + & {
    margin-top: 28px;
  }

  ${media.mobile} {
    & + & {
      margin: 24px -20px 0;
      padding: 0 20px;
      border-top: 8px solid ${({ theme }) => theme.colors.gray[100]};
    }
  }

  ${media.mini_mobile} {
    & + & {
      margin: 24px -10px 0;
      padding: 0 10px;
    }
  }
`;

export const SectionHeader = styled.div<{ $variant: 'default' | 'compact' }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  /* 낮은 밀도 행은 자체 위 여백(패딩)이 있어 제목 아래 여백을 줄인다 */
  margin: 28px 0 ${({ $variant }) => ($variant === 'compact' ? '6px' : '16px')};

  ${media.mobile} {
    margin: ${({ $variant }) =>
      $variant === 'compact' ? '20px 0 4px' : '16px 0 12px'};
  }
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.gray[950]};

  ${media.mobile} {
    font-size: 18px;
    line-height: 120%;
  }
`;

export const SectionCount = styled.span`
  margin-left: 6px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};
`;

export const TotalCountResult = styled.span`
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[800]};

  ${media.mobile} {
    font-size: 13px;
  }
`;

export const CardList = styled.div<{ $variant: 'default' | 'compact' }>`
  display: grid;
  width: 100%;
  max-width: 100%;
  /* 낮은 밀도 행은 구분선으로 나누므로 행 간격이 없다. 열 간격은 구간끼리 같게 둔다(다르면 두 구간의 열이 어긋난다) */
  gap: ${({ $variant }) => ($variant === 'compact' ? '0 20px' : '20px')};
  transition:
    gap 0.5s ease,
    grid-template-columns 0.5s ease;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  ${media.laptop} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 750px) {
    grid-template-columns: minmax(0, 1fr);
  }

  ${media.mobile} {
    gap: ${({ $variant }) => ($variant === 'compact' ? '0' : '10px')};
  }
`;

export const EmptyResult = styled.div`
  padding: 80px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[800]};
  font-size: 1.125rem;
  line-height: 1.6;
  white-space: pre-line;

  ${media.mobile} {
    font-size: 0.95rem;
  }
`;

export const RetryButton = styled.button`
  margin-top: 24px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[800]};
    box-shadow: 0 4px 12px rgba(255, 84, 20, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  ${media.mobile} {
    padding: 10px 24px;
    font-size: 14px;
  }
`;
