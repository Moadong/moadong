// 학생/운영진 전환 토글의 sticky 바와 슬라이딩 인디케이터 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

const WEBVIEW_TOP_BAR_HEIGHT = 48;

export const Bar = styled.div`
  position: sticky;
  top: ${HEADER_HEIGHT.desktop + 12}px;
  z-index: 10;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${HEADER_HEIGHT.desktop + 24}px;
  pointer-events: none;

  ${media.tablet} {
    top: ${WEBVIEW_TOP_BAR_HEIGHT + 8}px;
    margin-top: 16px;
  }
`;

export const Track = styled.div`
  display: flex;
  gap: 4px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid ${colors.gray[300]};
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  pointer-events: auto;
`;

export const Tab = styled.button<{ $selected: boolean }>`
  position: relative;
  padding: 10px 22px 10px 18px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: ${({ $selected }) =>
    $selected ? colors.base.white : colors.gray[700]};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ $selected }) =>
      $selected ? colors.base.white : colors.gray[900]};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[700]};
    outline-offset: 2px;
  }

  ${media.mobile} {
    padding: 9px 18px;
    font-size: 14px;
  }
`;

export const Indicator = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: ${colors.primary[900]};
  box-shadow: 0 4px 12px
    color-mix(in srgb, ${colors.primary[900]} 28%, transparent);
`;

export const Label = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  & > span:first-child {
    font-size: 20px;
  }

  ${media.mobile} {
    gap: 6px;

    & > span:first-child {
      font-size: 18px;
    }
  }
`;

export const LongText = styled.span`
  ${media.mobile} {
    display: none;
  }
`;

export const ShortText = styled.span`
  display: none;

  ${media.mobile} {
    display: inline;
  }
`;
