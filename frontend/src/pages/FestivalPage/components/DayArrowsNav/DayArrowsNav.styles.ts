import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px 0 14px;
  box-shadow: inset 0 -1px 0 #e0e0e0;
`;

export const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  font-size: 28px;
  line-height: 1;
  color: #3a3a3a;
  cursor: pointer;
  transition: color 0.15s ease-in-out;

  &:hover:not(:disabled) {
    color: #ff5414;
  }

  &:disabled {
    color: #d0d0d0;
    cursor: default;
  }
`;

export const DayLabel = styled.span`
  min-width: 160px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #3a3a3a;
`;
