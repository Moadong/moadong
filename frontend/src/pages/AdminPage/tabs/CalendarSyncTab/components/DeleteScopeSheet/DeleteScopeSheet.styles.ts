import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0 4px;
`;

/** 반복이 아닌 일정 삭제 시 보여주는 확인 문구 */
export const ConfirmMessage = styled.p`
  margin: 0;
  padding: 12px 4px;
  font-size: 1rem;
  color: ${colors.gray[900]};
`;

export const OptionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 4px;
  cursor: pointer;
`;

export const Checkbox = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1.5px solid
    ${({ $checked }) => ($checked ? colors.primary[800] : colors.gray[300])};
  background: ${({ $checked }) =>
    $checked ? colors.primary[800] : colors.base.white};
  color: ${colors.base.white};
`;

export const OptionLabel = styled.span`
  font-size: 1rem;
  color: ${colors.gray[900]};
`;

export const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: ${colors.gray[100]};
  color: ${colors.gray[700]};
  font-size: 1rem;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: ${colors.primary[800]};
  color: ${colors.base.white};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: ${colors.gray[300]};
    cursor: not-allowed;
  }
`;
