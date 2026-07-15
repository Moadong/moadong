import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 20px 0;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const UploadIcon = styled.img`
  width: 56px;
  height: 56px;
`;

export const Label = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.primary[700]};
`;
