import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

export const TabList = styled.div<{ $centerOnMobile: boolean }>`
  display: flex;
  align-items: center;

  ${media.tablet} {
    padding: 0 20px;
    justify-content: ${({ $centerOnMobile }) =>
      $centerOnMobile ? 'center' : 'flex-start'};
    box-shadow: inset 0 -1px 0 ${colors.gray[300]};
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
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

  ${media.tablet} {
    max-width: none;
    ${setTypography(typography.paragraph.p5)};
    font-weight: ${({ $active }) => ($active ? 700 : 500)};
    border-bottom-color: ${({ $active }) =>
      $active ? colors.gray[800] : 'transparent'};
  }
`;
