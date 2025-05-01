import styled from 'styled-components';

export const SearchBoxContainer = styled.form<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 345px;
  height: 36px;
  padding: 3px 20px;
  border: transparent;
  border-radius: 41px;
  background-color: #eeeeee;

  @media (max-width: 500px) {
    width: 255px;
    height: 36px;
    padding: 6px 16px;

    border: 1px solid
      ${({ isFocused }) =>
        isFocused ? 'rgba(255, 84, 20, 0.8)' : 'transparent'};
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

  @media (max-width: 550px) {
    font-size: 10px;
  }

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

export const SearchButton = styled.button<{ isFocused: boolean }>`
  border: none;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 698px) {
    img {
      width: 14px;
      height: 14px;
    }
  }

  @media (max-width: 550px) {
    img {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 500px) {
    img {
      width: 14px;
      height: 14px;
    }

    filter: ${({ isFocused }) =>
      isFocused
        ? 'invert(36%) sepia(83%) saturate(746%) hue-rotate(359deg) brightness(95%) contrast(92%)'
        : 'none'};
  }
`;
