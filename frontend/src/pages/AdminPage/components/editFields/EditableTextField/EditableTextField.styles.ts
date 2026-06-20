import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  min-height: 22px;
`;

export const Input = styled.textarea`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  resize: none;
  overflow: hidden;

  ${setTypography(typography.paragraph.p3)}
  line-height: 140%;
  color: ${colors.base.black};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
`;
