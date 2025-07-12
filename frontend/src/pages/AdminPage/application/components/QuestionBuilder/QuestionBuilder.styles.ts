import styled from 'styled-components';

export const QuestionMenu = styled.div`
  display: flex;
  max-width: 140px;
  width: 100%;
  flex-direction: column;
  gap: 4px;
`;

export const QuestionFieldContainer = styled.div`
  width: 100%;
`;

export const RequiredToggleButton = styled.div`
  display: flex;
  border: none;
  padding: 12px 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.375rem;
  background: #f5f5f5;
  cursor: pointer;
  margin: 0;
  color: #787878;
  font-size: 0.875rem;
  font-weight: 600;
  user-select: none;
`;

export const RequiredToggleCircle = styled.span<{ active?: boolean }>`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ active }) => (active ? '#ff5000' : '#ccc')};
  background-color: #fff;
  transition: background-color 0.2s ease;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #ff5000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${({ active }) => (active ? 1 : 0)};
    transition: opacity 0.1s ease;
  }
`;

export const SelectionToggleWrapper = styled.div`
  display: flex;
  background-color: #f7f7f7;
  border-radius: 0.375rem;
  padding: 2px;
`;

export const SelectionToggleButton = styled.button<{ active: boolean }>`
  border: none;
  background-color: ${(props) => (props.active ? '#ddd' : 'transparent')};
  color: #787878;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.42px;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
`;

export const QuestionWrapper = styled.div<{readOnly?: boolean}>`
  display: flex;
  gap: 36px;
  pointer-events: ${({ readOnly }) => (readOnly ? 'none' : 'auto')};
  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'auto')};
`;
