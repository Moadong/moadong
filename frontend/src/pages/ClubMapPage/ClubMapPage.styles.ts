import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const BackButton = styled.button`
  position: fixed;
  top: calc(12px + var(--rn-safe-top, 0px));
  left: 16px;
  z-index: 10;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background-color: ${colors.base.white};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const BottomCard = styled.div`
  position: fixed;
  bottom: calc(55px + var(--rn-safe-bottom, 0px));
  left: 20px;
  right: 20px;
  z-index: 10;
  background-color: ${colors.base.white};
  border-radius: 16px;
  padding: 24px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ClubLogo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  background-color: ${colors.gray[200]};
`;

export const ClubInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: hidden;
`;

export const ClubName = styled.span`
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 11px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const LocationText = styled.span`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${setTypography(typography.paragraph.p4)};
  color: ${colors.gray[700]};
  text-align: center;
`;
