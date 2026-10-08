import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';

// 당근 회사소개 지표 섹션 톤을 따른 색. 이 섹션에서만 쓴다
const CARD_BG = '#F7F8FA';
const NUMBER_COLOR = '#1A1C20';
const SUB_TEXT_COLOR = '#868B94';
const CLOSING_TEXT_COLOR = '#4D5159';

const FADE_UP_MS = 600;
const STAGGER_MS = 80;

export const Section = styled.section`
  /* 강조 숫자 색. 바꾸려면 이 변수만 덮어쓴다 */
  --accent: #ff6f0f;

  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  /* 위는 히어로가 이미 64px 여백을 두므로 아래만 같은 간격을 준다 */
  padding: 0 0 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: 'Pretendard', system-ui, sans-serif;

  ${media.mobile} {
    padding: 0 0 40px;
    gap: 24px;
  }
`;

export const Heading = styled.h2`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  color: ${NUMBER_COLOR};

  ${media.mobile} {
    font-size: 22px;
  }
`;

export const Caption = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${SUB_TEXT_COLOR};
`;

export const Grid = styled.ul`
  display: grid;
  /* minmax(0, 1fr): 줄바꿈 없는 숫자가 열을 밀어 넓히지 않게 열 폭을 고정한다 */
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  list-style: none;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const Card = styled.li<{
  $index: number;
  $isVisible: boolean;
  $animate: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 24px;
  border-radius: 20px;
  background: ${CARD_BG};
  container-type: inline-size;

  ${({ $animate, $isVisible, $index }) =>
    $animate &&
    css`
      opacity: ${$isVisible ? 1 : 0};
      transform: translateY(${$isVisible ? 0 : 16}px);
      transition:
        opacity ${FADE_UP_MS}ms ease-out,
        transform ${FADE_UP_MS}ms ease-out;
      transition-delay: ${$index * STAGGER_MS}ms;
    `}

  ${media.mobile} {
    padding: 24px 20px;
  }
`;

export const Label = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: ${SUB_TEXT_COLOR};
`;

export const Value = styled.p<{ $highlight: boolean }>`
  position: relative;
  /* 가장 긴 "약 18,000번"이 글자 크기의 약 4.6배 폭이라, 카드 안쪽 폭의 20%를 넘지 않게 줄인다 */
  font-size: min(52px, 20cqi);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $highlight }) => ($highlight ? 'var(--accent)' : NUMBER_COLOR)};
`;

/** 단위와 "약"은 숫자의 60% 크기, 같은 굵기 */
export const Small = styled.span`
  font-size: 0.6em;
`;

export const Desc = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: ${SUB_TEXT_COLOR};
`;

export const Closing = styled.p`
  padding: 24px 28px;
  border-radius: 20px;
  background: ${CARD_BG};
  font-size: 16px;
  line-height: 1.6;
  color: ${CLOSING_TEXT_COLOR};
  white-space: pre-line;

  ${media.mobile} {
    padding: 20px;
    font-size: 15px;
  }
`;

export const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
