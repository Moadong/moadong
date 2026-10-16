import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px 20px;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionTitle = styled.h2`
  ${setTypography(typography.title.title5)}
  letter-spacing: -0.02em;
  color: ${colors.base.black};
  margin: 0;
`;

export const SectionSubtitle = styled.p`
  ${setTypography(typography.button.button1)}
  letter-spacing: -0.02em;
  color: ${colors.gray[700]};
  margin: 0;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 51px;
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SortRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 12px;
`;

export const SortButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

export const SortText = styled.span`
  ${setTypography(typography.etc.medium12)}
  letter-spacing: -0.02em;
  color: ${colors.base.black};
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
