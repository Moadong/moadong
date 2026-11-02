import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

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
  color: ${colors.gray[600]};
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
  color: ${colors.gray[600]};
  line-height: 1.5;
  margin-bottom: 16px;
`;

export const ErrorDetails = styled.div`
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 16px;
  text-align: left;
`;

export const ErrorDetailsMessage = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.primary[900]};
  margin-top: 4px;
  word-break: break-word;
`;

export const RetryButton = styled.button`
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid ${colors.gray[400]};
  background: white;
  color: ${colors.gray[800]};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Pretendard', sans-serif;

  &:hover {
    background: ${colors.gray[100]};
    border-color: ${colors.gray[500]};
  }

  &:active {
    transform: scale(0.98);
  }
`;
