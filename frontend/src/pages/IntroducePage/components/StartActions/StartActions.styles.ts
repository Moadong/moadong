// 시작 버튼 묶음의 주 버튼(주황 채움)과 보조 버튼(흰 바탕 테두리) 스타일
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  /* 버튼이 두 줄로 내려가도 화면 끝에 붙지 않게 */
  ${media.mini_mobile} {
    padding: 0 16px;
    gap: 8px;
  }
`;

const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  ${setTypography(typography.title.title6)};
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[700]};
    outline-offset: 2px;
  }

  ${media.mobile} {
    height: 48px;
    padding: 0 20px;
    ${setTypography(typography.button.button1)};
  }
`;

export const Primary = styled.button`
  ${base};
  border: none;
  background: ${colors.primary[900]};
  color: ${colors.base.white};
  box-shadow: 0 8px 20px
    color-mix(in srgb, ${colors.primary[900]} 28%, transparent);

  @media (hover: hover) {
    &:hover {
      background: ${colors.primary[800]};
      transform: translateY(-2px);
    }
  }
`;

export const Secondary = styled.button`
  ${base};
  border: 1px solid ${colors.gray[400]};
  background: ${colors.base.white};
  color: ${colors.gray[900]};

  @media (hover: hover) {
    &:hover {
      border-color: ${colors.gray[600]};
      transform: translateY(-2px);
    }
  }
`;

/* 버튼 바로 아래에 QR 카드를 띄우는 기준점 */
export const DownloadAnchor = styled.div`
  position: relative;
`;

/* 토스 홈의 앱 다운로드 카드처럼: 흰 카드에 QR, 오른쪽 안내 문구, 우상단 닫기 */
/* 맨 아래 시작 버튼에서는 섹션이 아래를 잘라 내므로 카드를 버튼 위로 연다 */
export const QrCard = styled(motion.div)<{ $openUpward: boolean }>`
  position: absolute;
  ${({ $openUpward }) =>
    $openUpward ? 'bottom: calc(100% + 12px);' : 'top: calc(100% + 12px);'}
  left: 50%;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  gap: 16px;
  width: max-content;
  padding: 16px 20px 16px 16px;
  border-radius: 20px;
  background: ${colors.base.white};
  box-shadow:
    0 0 0 1px rgba(17, 17, 17, 0.05),
    0 12px 32px rgba(17, 17, 17, 0.12);
  translate: -50% 0;
  text-align: left;

  svg {
    display: block;
    flex-shrink: 0;
  }
`;

export const QrText = styled.p`
  padding-bottom: 2px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  color: ${colors.gray[800]};
`;

export const QrClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: ${colors.gray[100]};
  color: ${colors.gray[700]};
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: ${colors.gray[200]};
    }
  }
`;
