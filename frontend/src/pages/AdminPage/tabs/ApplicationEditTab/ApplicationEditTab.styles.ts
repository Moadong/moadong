import styled, { css } from 'styled-components';

export const FormTitle = styled.input`
  width: 100%;
  padding: 10px 12px;
  align-items: center;
  border-radius: 10px;
  background: var(--f5, #f5f5f5);
  font-size: 2.5rem;
  font-weight: 700;
  border: none;
  outline: none;
  margin: 35px 0px;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 83px;
`;

export const AddQuestionButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #555;
  margin-bottom: 60px;
  cursor: pointer;
`;

export const QuestionDivider = styled.hr`
  margin-top: 40px;
  margin-bottom: 40px;
  border: none;
  border-top: 1px solid #ddd;
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

export const HeaderContainer = styled.div`
  display: flex;
`;

export const ChangeButtonWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  height: 33px;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 0 0 1px var(--Gray-400, #dcdcdc) inset;
  width: fit-content;
`;

export const ApplicationFormChangeButton = styled.button<{ $active: Boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  padding: 8px 12px;
  white-space: nowrap;
  color: #787878;
  border: 0px;
  background: transparent;
  align-self: stretch;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.$active &&
    css`
      box-shadow:
        0 0 0 1px var(--Main-Primary-900, #ff5414) inset,
        0 1px 2px 0 rgba(0, 0, 0, 0.2);
      background: var(--Main-Primary-500, #ffece5);
      color: var(--Main-Primary-900, #ff5414);
    `}

  font-size: 12px;
  font-style: normal;
  font-weight: 600;
`;

export const ExternalApplicationFormContainer = styled.div`
  display: flex;
  padding: 6px 8px;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  background: var(--Gray-100, #f5f5f5);
`;

export const ExternalApplicationFormTitle = styled.div`
  display: inline-flex;
  height: 32px;
  padding: 6px 14px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const ExternalApplicationFormLinkInput = styled.input`
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  width: 100%;
  &::placeholder {
    color: var(--Gray-600, #989898);
  }
`;

export const ExternalApplicationFormHint = styled.div`
  color: var(--Gray-600, #989898);
  font-size: 12px;
  font-weight: 400;
  margin-top: 8px;
  margin-left: 4px;
`;
