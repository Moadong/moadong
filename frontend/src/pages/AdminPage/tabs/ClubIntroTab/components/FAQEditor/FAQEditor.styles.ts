import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.label`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.base.black};
`;

export const AddButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary[900]};
  color: ${({ theme }) => theme.colors.base.white};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  width: fit-content;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[700]};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.gray[400]};
`;

export const FAQItem = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FAQHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FAQNumber = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const QuestionInput = styled.input`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.base.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const AnswerTextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 8px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.base.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const CharCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: right;
`;
