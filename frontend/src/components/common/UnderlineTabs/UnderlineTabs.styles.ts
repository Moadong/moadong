import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';

export const TabList = styled.div<{ $centerOnMobile: boolean }>`
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid ${colors.gray[200]};

  ${media.tablet} {
    padding: 0 20px;
  }

  ${media.mobile} {
    justify-content: ${({ $centerOnMobile }) =>
      $centerOnMobile ? 'center' : 'flex-start'};
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 700;
  width: 167px;
  height: 26px;
  padding-bottom: 4px;
  color: ${({ $active }) => ($active ? colors.gray[800] : colors.gray[400])};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? colors.gray[800] : colors.gray[400])};
  cursor: pointer;
  transition:
    color ${transitions.duration.normal} ${transitions.easing.easeInOut},
    border-color ${transitions.duration.normal} ${transitions.easing.easeInOut};

  ${media.tablet} {
    flex: 1;
    width: auto;
  }
`;
