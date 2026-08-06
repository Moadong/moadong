import styled from 'styled-components';
import checkIcon from '@/assets/images/icons/checkBox.svg';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  height: 72px;
  padding: 12px 20px;
  gap: 12px;
  border-bottom: 1px solid ${colors.gray[200]};
  cursor: pointer;

  &:active {
    background: ${colors.gray[100]};
  }
`;

export const CheckboxWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export const Checkbox = styled.div<{ $checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid ${colors.gray[400]};
  background-color: ${colors.base.white};
  cursor: pointer;
  flex-shrink: 0;

  ${({ $checked }) =>
    $checked &&
    `
    border: 0;
    background: url("${checkIcon}") center/24px 24px no-repeat;
  `}
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

export const Name = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.base.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Memo = styled.span`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MemoEmpty = styled(Memo)`
  color: ${colors.gray[500]};
`;

export const Meta = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

export const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  height: 25px;
  border-radius: 8px;
  background: ${colors.gray[200]};
  ${setTypography(typography.button.button2)}
  color: ${colors.gray[900]};
`;

export const Date = styled.span`
  ${setTypography(typography.paragraph.p7)}
  width: 58px;
  align-self: stretch;
  color: ${colors.gray[600]};
`;
