import styled from 'styled-components';

export const FormTitle = styled.input`
  font-size: 2.5rem;
  font-weight: 700;
  border: none;
  outline: none;
  margin: 76px 0;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;
