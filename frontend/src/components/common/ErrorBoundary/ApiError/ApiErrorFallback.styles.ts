import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  min-height: 160px;
`;

export const Content = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

export const IconWrapper = styled.div`
  margin-bottom: 12px;
  color: #989898;
  display: flex;
  justify-content: center;

  svg {
    width: 36px;
    height: 36px;
  }
`;

export const Title = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 6px;
  line-height: 1.4;
`;

export const Message = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #989898;
  line-height: 1.5;
  margin-bottom: 16px;
`;

export const ErrorDetails = styled.div`
  background: #f8f8f8;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 16px;
  text-align: left;
`;

export const ErrorDetailsMessage = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #ff5414;
  margin-top: 4px;
  word-break: break-word;
`;

export const RetryButton = styled.button`
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  background: white;
  color: #4b4b4b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Pretendard', sans-serif;

  &:hover {
    background: #f5f5f5;
    border-color: #c5c5c5;
  }

  &:active {
    transform: scale(0.98);
  }
`;
