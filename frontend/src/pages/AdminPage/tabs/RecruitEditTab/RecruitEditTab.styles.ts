import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

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

export const AlwaysRecruitButton = styled.button<{ $isAlwaysActive: boolean }>`
  border-radius: 10px;
  width: 120px;
  height: 45px;
  padding: 0px 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;

  color: ${colors.gray[700]};
  background-color: ${colors.gray[300]};
  border: 1px solid ${colors.gray[500]};

  ${({ $isAlwaysActive }) =>
    $isAlwaysActive &&
    `
  color: ${colors.base.white};
  background-color: ${colors.primary[800]};
  border: none;
  `}
  transition:
    background-color 0.12s ease,
    transform 0.06s ease;

  &:active {
    transform: translateY(1px);
  }
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 8px;
  font-weight: 600;
`;
