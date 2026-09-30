import styled from 'styled-components';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

export const RecruitPeriodContainer = styled.div`
  display: flex;
  gap: 16px;
  max-width: 706px;
`;

export const AlwaysRecruitButtonWrapper = styled.div`
  flex-shrink: 0;

  button {
    width: 120px;
    height: 45px;
    ${setTypography(typography.paragraph.p2)};
  }
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 8px;
  font-weight: 600;
`;
