import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 360px;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

export const StartButton = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[800]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;
