import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 22px;
`;

export const Textarea = styled.textarea<{ $size?: 'default' | 'large' }>`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  resize: none;
  overflow: hidden;
  ${({ $size }) =>
    $size === 'large'
      ? setTypography(typography.paragraph.p3)
      : setTypography(typography.paragraph.p6)}
  line-height: 160%;
  color: ${colors.base.black};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;
