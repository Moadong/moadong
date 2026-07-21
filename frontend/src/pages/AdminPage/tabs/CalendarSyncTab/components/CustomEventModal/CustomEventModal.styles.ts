import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 320px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: ${colors.gray[700]};
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  & > label {
    flex: 1;
    min-width: 140px;
  }
`;

export const Input = styled.input`
  height: 42px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  padding: 0 12px;
  font-size: 0.9rem;
`;

export const TextArea = styled.textarea`
  min-height: 72px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.9rem;
  resize: vertical;
  font-family: inherit;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const DeleteButton = styled.button`
  margin-right: auto;
  border: 1px solid #fecaca;
  background: ${colors.base.white};
  border-radius: 10px;
  padding: 0 16px;
  height: 42px;
  font-size: 0.9rem;
  color: #dc2626;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #fef2f2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextButton = styled.button`
  border: 1px solid ${colors.gray[300]};
  background: ${colors.base.white};
  border-radius: 10px;
  padding: 0 16px;
  height: 42px;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${colors.gray[700]};

  &:hover:not(:disabled) {
    background: ${colors.gray[100]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #dc2626;
`;
