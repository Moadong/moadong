import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  background: ${colors.base.white};
  overflow: hidden;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 16px 20px 20px;
`;

export const Title = styled.p`
  ${setTypography(typography.title.title6)};
  color: ${colors.base.black};
  text-align: center;
  letter-spacing: -0.32px;
`;

export const Description = styled.p`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[600]};
  text-align: center;
  letter-spacing: -0.28px;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${colors.gray[200]};
`;

export const FooterButton = styled.button<{ $emphasized?: boolean }>`
  flex: 1;
  padding: 12px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  letter-spacing: -0.28px;
  ${({ $emphasized }) =>
    $emphasized
      ? setTypography(typography.button.button1)
      : setTypography(typography.paragraph.p5)};
  color: ${({ $emphasized }) =>
    $emphasized ? colors.primary[800] : colors.gray[700]};

  & + & {
    border-left: 1px solid ${colors.gray[200]};
  }
`;
