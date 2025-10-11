import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const SearchBoxContainer = styled.form<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 345px;
  height: 36px;
  padding: 3px 20px;
  border: 1px solid transparent;
  border-radius: 41px;
  background-color: ${({ $isFocused }) =>
    $isFocused ? '#ffffff' : '#eeeeee'};
  transition: all 0.2s ease-in-out;

  border-color: ${({ $isFocused }) =>
    $isFocused ? 'rgba(255, 84, 20, 0.8)' : 'transparent'};
  ${media.mobile} {
    width: 255px;
    height: 36px;
    padding: 6px 16px;
  }
`;

export const SearchInputStyles = styled.input`
  flex: 1;
  width: calc(100% - 32px);
  background-color: transparent;
  height: 36px;
  border: none;
  outline: none;
  font-size: 14px;

  &::placeholder {
    transition: opacity 0.3s;
  }

  &:focus::placeholder {
    opacity: 0;
  }

  ${media.mobile} {
    font-size: 12px;
  }

  ${media.mini_mobile} {
    font-size: 11px;
  }
`;

export const SearchButton = styled.button<{ $isFocused: boolean }>`
  flex-shrink: 0;
  border: none;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  width: 16px;
  height: 16px;

  img {
    width: 100%;
    height: 100%;
    transition: filter 0.2s ease-in-out;
  }

  filter: ${({ $isFocused }) =>
    $isFocused
      ? 'invert(36%) sepia(83%) saturate(746%) hue-rotate(359deg) brightness(95%) contrast(92%)'
      : 'none'};

  ${media.mobile} {
    width: 14px;
    height: 14px;
  }
`;
