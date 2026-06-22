import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);
`;

export const BannerArea = styled.div<{ $bgColor?: string }>`
  position: relative;
  width: 100%;
  height: 210px;
  background: ${({ $bgColor }) => $bgColor || colors.gray[400]};
  overflow: visible;
  flex-shrink: 0;
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BannerEditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 95px;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[700]};
  border-radius: 80px;
  cursor: pointer;
  ${setTypography(typography.button.button2)}
  color: ${colors.gray[700]};
  transition: all 0.2s;

  &:hover {
    background: ${colors.gray[700]};
    color: ${colors.base.white};
  }
`;

export const BannerButtonGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 6px;
`;

export const LogoWrapper = styled.div`
  position: absolute;
  left: 20px;
  bottom: -30px;
  width: 60px;
  height: 60px;
`;

export const LogoImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 4px solid ${colors.base.white};
  background: ${colors.gray[200]};
  object-fit: cover;
`;

export const LogoEditButton = styled.button`
  position: absolute;
  right: -12px;
  bottom: -9px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;

  svg {
    width: 32px;
    height: 32px;
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

export const TagPill = styled.button<{ $isSelected?: boolean; $color?: string }>`
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
  max-width: 400px;
  padding: 10px 24px 20px;
  background: ${colors.base.white};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;

  button {
    width: 100%;
    height: 50px;
    border-radius: 10px;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;
