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

export const Counter = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[900]};
  line-height: 140%;
`;

export const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 18px;
  width: 100%;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;
