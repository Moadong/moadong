import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
`;

export const Content = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

export const IconWrapper = styled.div`
  margin-bottom: 24px;
  color: #ff5414;
  display: flex;
  justify-content: center;

  svg {
    width: 64px;
    height: 64px;
  }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 16px;
  line-height: 1.4;
`;

export const Message = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #787878;
  line-height: 1.6;
  margin-bottom: 32px;
`;

export const ErrorDetails = styled.div`
  background: #f5f5f5;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
`;

export const ErrorDetailsTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #989898;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ff5414;
  margin-bottom: 12px;
  word-break: break-word;
`;

export const StackTrace = styled.pre`
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #4b4b4b;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  font-family: 'Pretendard', sans-serif;

  &:active {
    transform: scale(0.98);
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: #ff5414;
  color: white;

  &:hover {
    background: #ff7543;
    box-shadow: 0 4px 12px rgba(255, 84, 20, 0.3);
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: white;
  color: #4b4b4b;
  border: 1px solid #dcdcdc;

  &:hover {
    background: #f5f5f5;
    border-color: #c5c5c5;
  }
`;
