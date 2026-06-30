import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

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

export const BannerButtonGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 6px;
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

export const LogoWrapper = styled.div`
  position: absolute;
  left: 20px;
  bottom: -30px;
  width: 60px;
  height: 60px;
`;

export const LogoFrame = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 0.5px solid ${colors.gray[500]};
  box-shadow: 0 0 0 4px ${colors.base.white};
  background: ${colors.gray[200]};
  overflow: hidden;
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
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

export const HiddenInput = styled.input`
  display: none;
`;
