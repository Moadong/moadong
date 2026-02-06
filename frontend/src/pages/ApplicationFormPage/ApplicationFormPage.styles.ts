import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const FormTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  border: none;
  outline: none;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 0 15px;
`;

export const FormDescription = styled.div`
  white-space: pre-line;
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-top: -20px;
  margin-bottom: 48px;
  padding: 12px 18px;
  background-color: #f5f5f5;
  border-radius: 6px;

  ${media.mobile} {
    font-size: 0.95rem;
    line-height: 1.5;

    padding: 4px 6px;
  }
`;

export const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${media.mobile} {
    gap: 10px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const submitButton = styled.button`
  padding: 10px 40px;
  background-color: ${colors.gray[900]};
  border-radius: 10px;
  border: none;
  color: ${colors.base.white};
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.4px;
  transition: background-color 0.2s;
  margin: 50px 10px;

  &:hover {
    background-color: ${colors.gray[800]};
    animation: pulse 0.4s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
`;
