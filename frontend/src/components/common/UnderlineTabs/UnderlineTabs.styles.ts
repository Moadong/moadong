import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

export const TabList = styled.div<{ $centerOnMobile: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  ${media.tablet} {
    padding: 0 20px;
  }

  ${media.mobile} {
    justify-content: ${({ $centerOnMobile }) =>
      $centerOnMobile ? 'center' : 'flex-start'};
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  width: 260.33px;
  ${({ $active }) =>
    setTypography($active ? typography.title.title6 : typography.paragraph.p3)};
  padding-bottom: 4px;
  color: ${({ $active }) => ($active ? colors.gray[800] : colors.gray[500])};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? colors.gray[800] : colors.gray[500])};
  cursor: pointer;
  transition:
    color ${transitions.duration.normal} ${transitions.easing.easeInOut},
    border-color ${transitions.duration.normal} ${transitions.easing.easeInOut};
`;
