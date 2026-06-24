import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
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

export const CountText = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[900]};
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
