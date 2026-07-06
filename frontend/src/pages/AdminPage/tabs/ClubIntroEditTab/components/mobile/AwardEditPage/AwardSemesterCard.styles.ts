import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 18px;
  gap: 10px;
  width: 100%;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const SemesterLabel = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[800]};
  flex: 1;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AchievementRow = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 18px;
  gap: 8px;
  width: 100%;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;

  &:focus-within {
    border-color: ${colors.gray[800]};
  }
`;

export const AchievementInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  ${setTypography(typography.paragraph.p3)}
  color: ${colors.base.black};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
`;

