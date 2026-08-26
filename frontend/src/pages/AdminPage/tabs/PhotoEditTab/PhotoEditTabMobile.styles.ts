import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  min-height: 100dvh;
  margin: 0 auto;
  background: ${colors.base.white};
  padding-bottom: calc(80px + env(safe-area-inset-bottom) + 32px);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 32px;
`;

export const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 20px;
  gap: 16px;
  width: 100%;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};
`;

export const SectionSubtitle = styled.p`
  ${setTypography(typography.button.button1)};
  color: ${colors.gray[700]};
`;

export const GridSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const GridSectionTitle = styled.h2`
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};
  margin: 0;
  padding: 0 20px;
`;
