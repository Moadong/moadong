import styled, { keyframes } from 'styled-components';

const pop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(0.92); }
  100% { transform: scale(1); }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const ClubLabel = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;

  @media (max-width: 500px) {
    max-width: 140px;
    font-size: 0.875rem;
  }
`;

export const Button = styled.button<{ $clicking: boolean }>`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.primary[900]};
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(255, 84, 20, 0.35);
  animation: ${({ $clicking }) => ($clicking ? pop : 'none')} 0.15s ease;
  transition: box-shadow 0.2s;
  user-select: none;

  &:hover {
    box-shadow: 0 12px 32px rgba(255, 84, 20, 0.45);
  }

  &:active {
    transform: scale(0.92);
  }

  @media (max-width: 500px) {
    width: 140px;
    height: 140px;
    font-size: 1.2rem;
  }
`;

export const CountWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`;

export const Count = styled.p`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const CountLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-left: 4px;
`;
