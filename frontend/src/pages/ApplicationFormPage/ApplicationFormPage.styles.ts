import styled from 'styled-components';

export const FormTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  border: none;
  outline: none;
  margin-top: 30px;
  margin-bottom: 46px;
`;

export const QuestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media (max-width: 500px) {
    gap: 10px;
  }

`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const submitButton = styled.button`
  padding: 10px 56px;
  background-color: #ff5414;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.4px;
  transition: background-color 0.2s;
  margin: 50px 0;

  &:hover {
    background-color: #ffad8e;
    animation: pulse 0.4s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
`;
