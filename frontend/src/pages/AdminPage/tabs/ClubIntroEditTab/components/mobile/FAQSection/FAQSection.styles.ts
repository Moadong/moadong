import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
`;

export const Label = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[900]};
  line-height: 140%;
`;

export const EmptyCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 18px;
  gap: 8px;
  width: 100%;
  height: 99px;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;

export const EmptyDescription = styled.span`
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[600]};
  text-align: center;
`;

export const FAQCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 18px;
  gap: 10px;
  width: 100%;
  min-height: 110px;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;

export const QuestionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

export const QuestionContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

export const FAQNumber = styled.span`
  ${setTypography(typography.button.button1)}
  color: ${colors.primary[900]};
  flex-shrink: 0;
`;

export const QuestionInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.base.black};
  width: 100%;

  &::placeholder {
    color: ${colors.gray[600]};
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AnswerCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  gap: 4px;
  width: 100%;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: 10px;
`;

export const AnswerTextarea = styled.textarea`
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  overflow: hidden;
  ${setTypography(typography.paragraph.p6)}
  line-height: 160%;
  color: ${colors.base.black};
  width: 100%;

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const CharCount = styled.span`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[500]};
  text-align: right;
`;

export const AddButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  gap: 6px;
  background: ${colors.primary[800]};
  border: none;
  border-radius: 14px;
  cursor: pointer;
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};

  img {
    width: 16px;
    height: 16px;
  }
`;
