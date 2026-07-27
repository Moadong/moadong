import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 14px;
  width: 100%;
  background-color: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  box-sizing: border-box;
  gap: 2px;
`;

export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30px;
  gap: 4px;
`;

export const TitleArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const ActiveDot = styled.span`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${colors.primary[900]};
`;

export const Title = styled.span<{ $active: boolean }>`
  ${setTypography(typography.paragraph.p2)}
  letter-spacing: -0.02em;
  color: ${({ $active }) => ($active ? colors.primary[900] : colors.gray[800])};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MoreButtonContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;

  &:hover {
    background-color: ${colors.gray[400]};
  }
`;

export const DateText = styled.span`
  width: 100%;
  ${setTypography(typography.etc.medium12)}
  letter-spacing: -0.02em;
  color: ${colors.gray[600]};
`;
