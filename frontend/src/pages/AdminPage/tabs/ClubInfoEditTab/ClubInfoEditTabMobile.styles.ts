import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

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

export const SaveButtonArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  padding: 10px 24px calc(20px + env(safe-area-inset-bottom));
  background: ${colors.base.white};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  z-index: ${Z_INDEX.clubDetailFooter};

  ${media.mobile} {
    left: 0;
    transform: none;
    max-width: 100%;
  }

  button {
    width: 100%;
    height: 50px;
    border-radius: 10px;
  }

  button:disabled {
    background-color: ${colors.gray[500]};
    color: ${colors.base.white};
    opacity: 1;
  }
`;
