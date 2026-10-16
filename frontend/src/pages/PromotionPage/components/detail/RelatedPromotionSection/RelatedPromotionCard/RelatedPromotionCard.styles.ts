import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Card = styled.div`
  background: ${colors.base.white};
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const ClubTagWrapper = styled.div`
  margin-bottom: 6px;
`;
