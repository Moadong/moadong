import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  width: 100%;
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;

  ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
`;

export const PhotoItem = styled.div`
  aspect-ratio: 4 / 5;
  overflow: hidden;
  cursor: pointer;
  background-color: ${colors.gray[100]};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  color: ${colors.gray[500]};
`;
