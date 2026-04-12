import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';

const setTypography = (typo: { size: string; weight: number }) => `
  font-size: ${typo.size};
  font-weight: ${typo.weight};
`;

export const Card = styled.div`
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
