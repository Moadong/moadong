import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  padding: 0 16px;
`;

export const SectionBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 16px 4px 12px;
`;

export const SectionTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #787878;
`;

export const TotalCount = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #787878;
`;

export const CardListWrapper = styled.div`
  width: 100%;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
`;

export const EmptyResult = styled.div`
  padding: 80px 20px;
  text-align: center;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-line;
`;

export const ActionButton = styled.button`
  display: inline-block;
  margin-top: 24px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;
