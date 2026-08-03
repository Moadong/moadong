import styled from 'styled-components';
import CheckCircleIcon from '@/assets/images/icons/check_circle_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 18px;
  gap: 10px;
  border-radius: 14px;
  border: 1px solid ${colors.gray[200]};
  background: ${colors.gray[50]};
  box-sizing: border-box;
  width: 100%;
`;

export const QuestionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 24px;
`;

export const QuestionIndex = styled.span`
  ${setTypography(typography.title.title6)}
  color: ${colors.primary[800]};
  flex-shrink: 0;
`;

export const QuestionTitle = styled.span`
  ${setTypography(typography.title.title6)}
  color: ${colors.gray[900]};
`;

export const Required = styled.span`
  font-size: ${typography.title.title5.size};
  font-weight: ${typography.title.title5.weight};
  line-height: ${typography.title.title5.lineHeight};
  color: ${colors.primary[900]};
  flex-shrink: 0;
`;

export const TextAnswerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 14px;
  gap: 10px;
  width: 100%;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[100]};
  border-radius: 10px;
  box-sizing: border-box;
`;

export const TextAnswer = styled.p<{ $isEmpty: boolean }>`
  flex: 1;
  ${setTypography(typography.paragraph.p6r)}
  letter-spacing: -0.02em;
  color: ${({ $isEmpty }) => ($isEmpty ? colors.gray[400] : colors.base.black)};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const ChoiceItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 14px;
  gap: 8px;
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: 1px solid
    ${({ $isSelected }) =>
      $isSelected ? colors.primary[700] : colors.gray[100]};
  background: ${({ $isSelected }) =>
    $isSelected ? colors.primary[500] : colors.base.white};
  box-sizing: border-box;
`;

export const CheckIcon = styled(CheckCircleIcon)`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: ${colors.primary[700]};
`;

export const ChoiceLabel = styled.span`
  flex: 1;
  ${setTypography(typography.paragraph.p6r)}
  letter-spacing: -0.02em;
  color: ${colors.base.black};
`;
