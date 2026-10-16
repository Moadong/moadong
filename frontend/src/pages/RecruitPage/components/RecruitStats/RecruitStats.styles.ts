import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { setTypography } from '@/styles/theme/typography';

const STAGGER_MS = 80;

export const Section = styled.section`
  /* 강조 숫자 색. 바꾸려면 이 변수만 덮어쓴다 */
  --accent: ${({ theme }) => theme.colors.primary[900]};

  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  /* 위는 히어로가 이미 64px 여백을 두므로 아래만 같은 간격을 준다 */
  padding: 0 0 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${media.mobile} {
    padding: 0 0 40px;
    gap: 24px;
  }
`;

export const Heading = styled.h2`
  ${({ theme }) => setTypography(theme.typography.etc.bold28)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.title.title4)};
  }
`;

export const Caption = styled.span`
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
  color: ${({ theme }) => theme.colors.gray[700]};
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
  background: ${({ theme }) => theme.colors.gray[100]};
  container-type: inline-size;

  ${({ $animate, $isVisible, $index, theme }) =>
    $animate &&
    css`
      opacity: ${$isVisible ? 1 : 0};
      transform: translateY(${$isVisible ? 0 : 16}px);
      transition:
        opacity ${theme.transitions.duration.slow}
          ${theme.transitions.easing.easeOut},
        transform ${theme.transitions.duration.slow}
          ${theme.transitions.easing.easeOut};
      transition-delay: ${$index * STAGGER_MS}ms;
    `}

  ${media.mobile} {
    padding: 24px 20px;
  }
`;

export const Label = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p3)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const Value = styled.p<{ $highlight: boolean }>`
  position: relative;
  /* 가장 긴 값(단위·접두어 포함 약 4.6em)도 카드 안에 들어가도록 카드 안쪽 폭의 20%를 넘지 않게 줄인다 */
  font-size: min(52px, 20cqi);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $highlight, theme }) =>
    $highlight ? 'var(--accent)' : theme.colors.base.black};
`;

/** 단위와 "약"은 숫자의 60% 크기, 같은 굵기 */
export const Small = styled.span`
  font-size: 0.6em;
`;

export const Desc = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const Closing = styled.p`
  padding: 24px 28px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.gray[100]};
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[800]};
  white-space: pre-line;

  ${media.mobile} {
    padding: 20px;
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
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
