import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const SearchBarArea = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 8px;

  form {
    max-width: none;
  }
`;

export const LogoImage = styled.img`
  flex-shrink: 0;
  height: 24px;
  width: auto;
`;

export const ContentArea = styled.div`
  padding: 0 16px;
`;

export const SectionBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 12px 4px 12px;
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
  margin-bottom: 60px;
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

export const SubscribeButton = styled.button<{ $subscribed: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $subscribed }) => ($subscribed ? '#FF4D6D' : '#C5C5C5')};
  padding: 4px;
  margin-left: 8px;
  border-radius: 50%;
  transition: color 0.2s ease;

  &:active {
    transform: scale(0.88);
    transition: transform 0.1s ease;
  }
`;

export const RetryButton = styled.button`
  margin-top: 24px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

`;
