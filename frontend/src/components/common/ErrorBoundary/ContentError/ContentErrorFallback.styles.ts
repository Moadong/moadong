import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
`;

export const Content = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 40px 28px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
`;

export const IconWrapper = styled.div`
  margin-bottom: 20px;
  color: #ff5414;
  display: flex;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;
  }
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 12px;
  line-height: 1.4;
`;

export const Message = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: #787878;
  line-height: 1.6;
  margin-bottom: 28px;
`;

export const ErrorDetails = styled.div`
  background: #f5f5f5;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 28px;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
`;

export const ErrorMessage = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #ff5414;
  word-break: break-word;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
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
