import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 42px;
  padding: 0 20px;
`;

export const TagList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
`;

export const TagPill = styled.button<{
  $isSelected?: boolean;
  $color?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ $isSelected, $color }) =>
    $isSelected && $color ? $color : colors.gray[200]};
  color: ${colors.gray[800]};
  ${setTypography(typography.button.button2)}
  text-align: center;
`;

export const FreeTagPill = styled.span`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: ${colors.gray[200]};
  border-radius: 8px;
  color: ${colors.base.black};
  ${setTypography(typography.button.button2)}
  text-align: center;
`;

export const CountText = styled.span`
  ${setTypography(typography.paragraph.p2)}
  line-height: 140%;
  color: ${colors.base.black};
`;

export const NavFieldContent = styled.span`
  ${setTypography(typography.paragraph.p2)}
  line-height: 140%;
  color: ${colors.gray[500]};
`;
