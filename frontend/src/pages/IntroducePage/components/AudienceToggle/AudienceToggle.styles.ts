// 학생/운영진 전환 토글의 sticky 바와 슬라이딩 인디케이터 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

/* 큰 토글은 첫 화면 위에 그대로 두고(따라다니지 않는다), 작은 토글은 헤더 가운데에 들어간다 */
export const Bar = styled.div<{ $compact: boolean }>`
  display: flex;
  justify-content: center;
  width: ${({ $compact }) => ($compact ? 'auto' : '100%')};
  margin-top: ${({ $compact }) => ($compact ? 0 : 32)}px;

  ${media.tablet} {
    margin-top: ${({ $compact }) => ($compact ? 0 : 16)}px;
  }
`;

export const Track = styled.div<{ $compact: boolean }>`
  display: flex;
  gap: ${({ $compact }) => ($compact ? 2 : 4)}px;
  padding: ${({ $compact }) => ($compact ? 3 : 5)}px;
  border-radius: 999px;
  background: ${({ $compact }) =>
    $compact ? colors.gray[100] : colors.base.white};
  border: 1px solid
    ${({ $compact }) => ($compact ? 'transparent' : colors.gray[300])};
  box-shadow: ${({ $compact }) =>
    $compact ? 'none' : '0 6px 24px rgba(0, 0, 0, 0.06)'};
`;

export const Tab = styled.button<{ $selected: boolean; $compact: boolean }>`
  position: relative;
  padding: ${({ $compact }) =>
    $compact ? '6px 14px 6px 10px' : '10px 22px 10px 18px'};
  border: none;
  border-radius: 999px;
  background: transparent;
  color: ${({ $selected }) =>
    $selected ? colors.base.white : colors.gray[700]};
  font-size: ${({ $compact }) => ($compact ? 14 : 16)}px;
  font-weight: 700;
  white-space: nowrap;
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
    padding: ${({ $compact }) => ($compact ? '5px 12px 5px 9px' : '9px 18px')};
    font-size: ${({ $compact }) => ($compact ? 13 : 14)}px;
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
  gap: 0.4em;

  & > span:first-child {
    font-size: 1.25em;
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
