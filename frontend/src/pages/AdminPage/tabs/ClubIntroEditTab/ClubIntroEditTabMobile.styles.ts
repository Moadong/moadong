import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: calc(80px + env(safe-area-inset-bottom) + 32px);
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 32px 20px 0;
`;

export const PageTitle = styled.h2`
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[700]};
  margin: -22px 0 0;
`;

export const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TextArea = styled.textarea`
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  overflow: hidden;
  width: 100%;
  min-height: 22px;
  ${setTypography(typography.paragraph.p6)}
  line-height: 160%;
  color: ${colors.base.black};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;
