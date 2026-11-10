import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div<{ $focused: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 14px;
  border: 1px solid
    ${({ $focused }) => ($focused ? colors.primary[700] : colors.gray[200])};
  background: ${({ $focused }) =>
    $focused ? colors.base.white : colors.gray[50]};
`;

/** 이름 질문처럼 수정할 수 없는 카드는 안쪽 입력을 막고 카드 자체만 길게 눌러 옮길 수 있다 */
export const Body = styled.div<{ $locked: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: ${({ $locked }) => ($locked ? 'none' : 'auto')};
`;

export const TypeTrigger = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  box-sizing: border-box;
  border: 1px solid
    ${({ $open }) => ($open ? colors.primary[700] : colors.gray[200])};
  border-radius: 10px;
  background: ${colors.base.white};
  color: ${colors.gray[800]};
  ${setTypography(typography.button.button1)};
  cursor: pointer;

  svg {
    flex-shrink: 0;
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;

  > div {
    width: 100%;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 10px;
  border-bottom: 1px solid ${colors.gray[300]};
`;

export const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  color: ${colors.gray[700]};
  ${setTypography(typography.button.button1)};
  cursor: pointer;
`;

export const CheckCircle = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ $checked }) =>
    $checked ? colors.primary[800] : colors.gray[400]};
  color: ${colors.base.white};
  font-size: 11px;
  line-height: 1;
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0;
  border: none;
  background: none;
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p5)};
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    color: ${colors.gray[400]};
  }
`;

export const QuestionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const QuestionNumber = styled.span`
  color: ${colors.primary[900]};
  ${setTypography(typography.title.title6)};
`;

export const TitleInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: ${colors.gray[900]};
  ${setTypography(typography.title.title6)};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const DescriptionInput = styled.input`
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: ${colors.gray[700]};
  ${setTypography(typography.paragraph.p5)};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const AnswerPlaceholder = styled.div`
  padding: 12px 18px;
  border-radius: 10px;
  background: ${colors.gray[300]};
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p5)};
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ItemInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const ItemInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 14px;
  box-sizing: border-box;
  border: 1px solid ${colors.gray[200]};
  border-radius: 10px;
  outline: none;
  background: ${colors.base.white};
  color: ${colors.gray[800]};
  ${setTypography(typography.paragraph.p5)};

  &::placeholder {
    color: ${colors.gray[500]};
    font-weight: 400;
  }

  &:focus {
    border-color: ${colors.gray[800]};
  }
`;

export const ItemClearButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  display: flex;
  padding: 0;
  border: none;
  background: none;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const AddItemButton = styled.button`
  align-self: flex-start;
  padding: 4px 0;
  border: none;
  background: none;
  color: ${colors.gray[700]};
  ${setTypography(typography.paragraph.p5)};
  cursor: pointer;
`;
