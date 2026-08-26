import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  background: ${colors.base.white};
`;

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 16px 10px 20px;
`;

export const Icon = styled.span`
  display: flex;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const Title = styled.h3`
  margin: 0;
  text-align: center;
  letter-spacing: -0.32px;
  color: ${colors.base.black};
  ${setTypography(typography.title.title6)};
`;

export const Description = styled.p`
  margin: 0;
  text-align: center;
  letter-spacing: -0.28px;
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p5)};
`;

export const Actions = styled.div`
  display: flex;
  width: 100%;
  border-top: 1px solid ${colors.gray[200]};
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: 12px 10px;
  border: none;
  background: none;
  cursor: pointer;
  letter-spacing: -0.28px;
`;

export const CancelButton = styled(ActionButton)`
  color: ${colors.gray[700]};
  ${setTypography(typography.paragraph.p5)};
`;

export const ConfirmButton = styled(ActionButton)`
  border-left: 1px solid ${colors.gray[200]};
  color: ${colors.primary[800]};
  ${setTypography(typography.button.button1)};
`;
