import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

export const Item = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.gray[100]};
`;

export const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const PendingBadge = styled.span`
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.7);
  color: ${colors.base.white};
  font-size: 0.75rem;
  font-weight: 500;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const AddTile = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  aspect-ratio: 1;
  border: 2px dashed ${colors.gray[400]};
  border-radius: 12px;
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
