import styled from 'styled-components';

export const EmptyMessage = styled.div`
  padding: 16px 8px;
  color: #9d9d9d;
  text-align: center;
  font-weight: 600;
`;

export const List = styled.div`
  display: grid;
  gap: 16px;
`;

export const OptionButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  background: #fff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: #ff7543;
    color: #fff;
    border-color: #ff7543;
  }
`;
