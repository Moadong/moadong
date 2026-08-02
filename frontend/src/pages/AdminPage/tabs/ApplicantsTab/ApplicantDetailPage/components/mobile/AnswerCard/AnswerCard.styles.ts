import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid ${colors.gray[300]};
  background: ${colors.base.white};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const QuestionMeta = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

export const QuestionIndex = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.primary[800]};
`;

export const Required = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.primary[800]};
`;

export const QuestionTitle = styled.p`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.base.black};
`;

export const QuestionDescription = styled.p`
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[600]};
`;

export const AnswerSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TextAnswer = styled.p<{ $isEmpty: boolean }>`
  ${setTypography(typography.paragraph.p5)}
  color: ${({ $isEmpty }) => ($isEmpty ? colors.gray[400] : colors.gray[800])};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChoiceItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${({ $isSelected }) =>
    $isSelected ? colors.primary[500] : colors.gray[100]};
`;

export const ChoiceIndicator = styled.div<{
  $isSelected: boolean;
  $isMulti: boolean;
}>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: ${({ $isMulti }) => ($isMulti ? '4px' : '50%')};
  border: 2px solid
    ${({ $isSelected }) =>
      $isSelected ? colors.primary[800] : colors.gray[400]};
  background: ${({ $isSelected }) =>
    $isSelected ? colors.primary[800] : 'transparent'};
  position: relative;

  ${({ $isSelected }) =>
    $isSelected &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: white;
    }
  `}
`;

export const ChoiceLabel = styled.span<{ $isSelected: boolean }>`
  ${setTypography(typography.paragraph.p5)}
  color: ${({ $isSelected }) =>
    $isSelected ? colors.primary[900] : colors.gray[700]};
`;
