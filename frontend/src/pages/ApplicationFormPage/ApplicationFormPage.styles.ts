import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const FormTitle = styled.h1`
  font-size: 40px;
  font-weight: 700;
  border: none;
  outline: none;
  margin-top: 110px;

  ${media.tablet} {
    font-size: 28px;
    margin-top: 50px;
  }
`;

export const FormDescription = styled.div`
  white-space: pre-line;
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.gray[800]};
  margin-top: 10px;
  padding: 12px 18px;
  background-color: ${colors.gray[100]};
  border-radius: 6px;

  ${media.tablet} {
    font-size: 0.95rem;
    line-height: 1.5;
    padding: 10px 14px;
  }
`;

export const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 46px;
  gap: 20px;
  ${media.tablet} {
    gap: 10px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SubmitButton = styled(Button)`
  height: 44px;
  padding: 10px 40px;
  background-color: ${colors.gray[900]};
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.2px;
  margin: 50px 4px;

  ${media.tablet} {
    && {
      width: 100%;
      max-width: 100%;

    }  
  }
`;
