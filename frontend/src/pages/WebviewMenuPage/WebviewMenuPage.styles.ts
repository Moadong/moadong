import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: none;
  cursor: pointer;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: left;

  &:active {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const Version = styled.p`
  margin: 24px 20px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[500]};
`;
