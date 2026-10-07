import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background-color: #303030;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.35px;
  line-height: 1.3;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.99);
  }
`;
