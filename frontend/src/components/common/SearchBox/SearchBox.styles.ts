import styled from 'styled-components';

export const SearchBoxContainer = styled.form<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  height: 36px;
  padding: 10px 20px;
  border: 1px solid
    ${({ isFocused }) => (isFocused ? 'rgba(255, 84, 20, 0.8)' : 'transparent')};
  border-radius: 41px;
  background-color: #eeeeee;

  @media (max-width: 500px) {
    width: 270px;
    height: 28px;
  }
`;

export const SearchInputStyles = styled.input`
  width: 100%;
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
`;

export const SearchButton = styled.button`
  border: none;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
  margin-top: 2px;

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
`;
