import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 360px;
`;

export const Title = styled.h2<{ $dark: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ $dark, theme }) => ($dark ? '#FFFFFF' : theme.colors.gray[900])};
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const Input = styled.input<{ $hasError: boolean; $dark: boolean }>`
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  background: ${({ $dark }) => ($dark ? '#1E1E2A' : '#FFFFFF')};
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[100] : theme.colors.gray[900]};
  border: 2px solid
    ${({ theme, $hasError, $dark }) =>
      $hasError
        ? theme.colors.primary[900]
        : $dark
          ? '#3A3A4A'
          : theme.colors.gray[300]};
  border-radius: 10px;
  outline: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s;
  min-width: 0;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }

  &::placeholder {
    color: ${({ $dark, theme }) =>
      $dark ? theme.colors.gray[600] : theme.colors.gray[500]};
  }

  ${media.mobile} {
    padding: 10px 12px;
    font-size: 0.875rem;
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

  ${media.mobile} {
    padding: 10px 14px;
    font-size: 0.875rem;
  }
`;

export const Dropdown = styled.ul<{ $dark: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${({ $dark }) => ($dark ? '#1E1E2A' : '#fff')};
  border: 1.5px solid
    ${({ $dark, theme }) => ($dark ? '#3A3A4A' : theme.colors.gray[200])};
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

export const DropdownItem = styled.li<{ $dark: boolean }>`
  padding: 10px 16px;
  font-size: 0.95rem;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[200] : theme.colors.gray[800]};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ $dark, theme }) =>
      $dark ? '#2A2A38' : theme.colors.gray[100]};
  }

  & + & {
    border-top: 1px solid
      ${({ $dark, theme }) => ($dark ? '#3A3A4A' : theme.colors.gray[100])};
  }
`;

export const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary[900]};
  font-weight: 500;
`;

export const CancelButton = styled.button<{ $dark: boolean }>`
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[500] : theme.colors.gray[500]};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${({ $dark, theme }) =>
      $dark ? theme.colors.gray[300] : theme.colors.gray[700]};
  }
`;
