import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  ${setTypography(typography.paragraph.p2)}
  line-height: 1.4;
  height: calc(1.4em * 2);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;

  ${media.mini_mobile} {
    ${setTypography(typography.button.button1)}
    margin-bottom: 2px;
  }
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${media.mini_mobile} {
    font-size: 14px;
    margin-bottom: 1px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  margin: 2px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    color: ${colors.gray[700]};
  }

  ${media.mobile} {
    width: 14px;
    height: 14px;
    margin: 1.5px 0px;
  }
`;

export const MetaText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.mini_mobile} {
    font-size: 12px;
  }
`;
