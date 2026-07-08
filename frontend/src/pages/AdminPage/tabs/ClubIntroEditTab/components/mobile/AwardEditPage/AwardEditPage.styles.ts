import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AwardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PageTitle = styled.h2`
  margin: 0;
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[700]};
`;

export const EmptyCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 18px;
  gap: 10px;
  width: 100%;
  min-height: 120px;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;

export const EmptyText = styled.span`
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[700]};
`;

export const SemesterAddButton = styled.button`
  position: fixed;
  bottom: calc(101px + env(safe-area-inset-bottom));
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 133.333px;
  background: ${colors.primary[900]};
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.16);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
