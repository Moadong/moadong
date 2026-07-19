import styled from 'styled-components';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #ffffff;
  padding-bottom: 101px;
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 0px;
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
  color: #111111;
  margin: 0;
`;

export const SectionSubtitle = styled.p`
  ${setTypography(typography.button.button1)};
  color: #787878;
  margin: 0;
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
  color: #111111;
  margin: 0;
  padding: 0 20px;
`;
