import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 80px 20px;
`;

export const Message = styled.p`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[600]};
  text-align: center;
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: ${colors.primary[800]};
  ${setTypography(typography.button.button1)}
  color: ${colors.base.white};
  cursor: pointer;

  &:active {
    background: ${colors.primary[900]};
  }
`;
