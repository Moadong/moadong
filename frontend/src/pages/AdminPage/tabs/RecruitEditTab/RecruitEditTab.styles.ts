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

export const AlwaysRecruitButton = styled.button<{ $active: boolean }>`
  border-radius: 10px;
  width: 120px;
  height: 45px;
  padding: 0px 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;

  color: ${({ $active }) => ($active ? colors.base.white : colors.gray[700])};
  background: ${({ $active }) =>
    $active ? colors.primary[800] : colors.gray[300]};
  border: ${({ $active }) =>
    $active ? 'none' : `1px solid ${colors.gray[500]}`};
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

export const Tilde = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${colors.gray[600]};
  display: flex;
  align-items: center;
`;

