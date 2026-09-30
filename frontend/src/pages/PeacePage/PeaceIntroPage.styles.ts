import styled from 'styled-components';
import { FIXED_BOTTOM_BUTTON_AREA_HEIGHT } from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea.styles';
import { media } from '@/styles/mediaQuery';
import { setTypography } from '@/styles/theme/typography';
import { PEACE_GREEN } from './constants/peaceColors';

export const Hero = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;

  ${media.tablet} {
    /* 아래 고정 버튼에 가리지 않게 */
    padding-bottom: ${FIXED_BOTTOM_BUTTON_AREA_HEIGHT}px;
  }
`;

export const Dove = styled.img`
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
  filter: drop-shadow(0 12px 24px ${PEACE_GREEN.shadow});
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${PEACE_GREEN.main};
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.base.black};
`;

export const Description = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-line;
`;

export const StartButton = styled.button`
  width: 100%;
  min-height: 56px;
  margin-top: auto;
  margin-bottom: 24px;
  border: none;
  border-radius: 16px;
  background: ${PEACE_GREEN.main};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title6)};
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }

  /* 모바일·태블릿은 동아리 상세의 '지원하기'(FixedBottomButtonArea)와 같은 자리에 고정 */
  ${media.tablet} {
    position: fixed;
    bottom: calc(20px + env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    /* 본문 칼럼(440px) 안에 머물도록 좌우 20px을 뺀 400px까지만 */
    width: calc(100% - 40px);
    max-width: 400px;
    min-height: 50px;
    margin: 0;
    border-radius: 14px;
    ${({ theme }) => setTypography(theme.typography.paragraph.p2)};

    &:active {
      transform: translateX(-50%) scale(0.98);
    }
  }
`;
