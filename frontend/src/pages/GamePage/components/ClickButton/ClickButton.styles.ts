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

export const ButtonArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;


export const ClubRow = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ChangeButton = styled.button<{ $dark: boolean }>`
  background: none;
  border: none;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[500] : theme.colors.gray[500]};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[900]};
  }

  @media (max-width: 500px) {
    font-size: 0.7rem;
  }
`;

export const ClubLabel = styled.p<{ $dark: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[400] : theme.colors.gray[700]};
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
  position: relative;
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
    width: 160px;
    height: 160px;
    font-size: 1.2rem;
    padding: 50px;
    margin: -50px;
    box-sizing: content-box;
    background-clip: content-box;
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

export const CountLabel = styled.span<{ $dark: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[400] : theme.colors.gray[600]};
  margin-left: 4px;
`;
