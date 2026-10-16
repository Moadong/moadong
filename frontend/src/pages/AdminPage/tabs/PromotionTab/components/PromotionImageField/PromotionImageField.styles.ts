import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
`;

export const Label = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
`;

export const Count = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
`;

/* ImageSortGrid 안의 마지막 칸. 사진 타일과 같은 비율이어야 줄이 맞는다 */
export const AddTile = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  aspect-ratio: 123 / 160;
  border: 2px dashed ${colors.gray[400]};
  background: ${colors.gray[50]};
  color: ${colors.gray[600]};
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.15s ease;

  span:first-child {
    font-size: 1.5rem;
    line-height: 1;
  }

  &:hover:not(:disabled) {
    border-color: ${colors.gray[600]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HelperText = styled.p`
  margin-top: 8px;
  font-size: 0.8125rem;
  color: ${colors.gray[600]};
`;
