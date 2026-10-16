import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
`;

export const Label = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[900]};
  line-height: 140%;
`;

export const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px 18px;
  gap: 5px;
  width: 100%;
  min-height: 52px;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;

export const AwardRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  width: 100%;
  cursor: pointer;
`;

export const SemesterChip = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 10.5px;
  width: 90px;
  height: 32px;
  flex-shrink: 0;
  white-space: nowrap;
  background: ${colors.gray[200]};
  border: 1px solid ${colors.gray[400]};
  border-radius: 100px;
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[800]};
`;

export const RightArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

export const EmptyText = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[500]};
`;

export const AchievementCount = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[900]};
`;

export const NavButton = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
