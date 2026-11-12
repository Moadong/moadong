import styled from 'styled-components';
import LinkSvg from '@/assets/images/icons/link_icon.svg?react';
import UnderlineTabs from '@/components/common/UnderlineTabs/UnderlineTabs';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: calc(80px + env(safe-area-inset-bottom) + 40px);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
  padding: 0 20px;
`;

export const Tabs = styled(UnderlineTabs)`
  padding: 0;

  button {
    flex: none;
    padding: 10px;
  }
`;

export const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
  color: ${colors.gray[900]};
  ${setTypography(typography.button.button1)};
`;

const fieldBox = `
  width: 100%;
  box-sizing: border-box;
  padding: 16px 18px;
  border-radius: 14px;
  outline: none;
`;

export const TextInput = styled.input`
  ${fieldBox}
  border: 1px solid ${colors.gray[300]};
  background: ${colors.gray[50]};
  color: ${colors.gray[900]};
  ${setTypography(typography.paragraph.p6)};

  &::placeholder {
    color: ${colors.gray[500]};
  }

  &:focus {
    border-color: ${colors.gray[800]};
  }
`;

export const TextArea = styled.textarea`
  ${fieldBox}
  min-height: 120px;
  resize: none;
  border: 1px solid ${colors.gray[300]};
  background: ${colors.gray[50]};
  color: ${colors.gray[900]};
  font-family: inherit;
  ${setTypography(typography.paragraph.p6)};

  &::placeholder {
    color: ${colors.gray[500]};
  }

  &:focus {
    border-color: ${colors.gray[800]};
  }
`;

export const LinkBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  background: ${colors.gray[50]};

  /* 링크 입력에 포커스가 있으면 지원자 검색창처럼 테두리로 보여 준다 */
  &:focus-within {
    border-color: ${colors.primary[800]};
    background: ${colors.base.white};
  }

  @media (forced-colors: active) {
    &:focus-within {
      outline: 2px solid Highlight;
    }
  }
`;

export const LinkIcon = styled(LinkSvg)`
  flex-shrink: 0;
  color: ${colors.accent[1][950]};
`;

export const LinkInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: ${colors.accent[1][950]};
  text-decoration: underline;
  ${setTypography(typography.paragraph.p5)};

  &::placeholder {
    color: ${colors.gray[500]};
    text-decoration: none;
  }
`;

export const Hint = styled.p`
  margin: 0;
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p7)};
`;

export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/** 툴팁이 떠 있는 동안 첫 질문 카드를 딤 위로 올린다 */
export const CardSlot = styled.div<{ $raised: boolean }>`
  position: relative;
  z-index: ${({ $raised }) => ($raised ? Z_INDEX.overlay + 1 : 'auto')};
`;

export const AddQuestionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 10px 12px;
  border: none;
  border-radius: 14px;
  background: ${colors.primary[800]};
  color: ${colors.base.white};
  ${setTypography(typography.button.button2)};
  cursor: pointer;
`;

export const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${Z_INDEX.overlay};
  background: ${colors.base.black}80;
`;

export const Tooltip = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  padding: 10px 14px;
  border-radius: 100px;
  background: ${colors.gray[800]};
  color: ${colors.base.white};
  white-space: nowrap;
  transform: translateX(-50%);
  ${setTypography(typography.button.button2)};

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    border-bottom: 7px solid ${colors.gray[800]};
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    transform: translateX(-50%);
  }
`;

/** 미리보기는 지원자 화면 그대로 보여 주되 입력·선택은 막는다 */
export const PreviewFieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  pointer-events: none;
`;

export const PreviewTitle = styled.h2`
  margin: 0;
  color: ${colors.base.black};
  ${setTypography(typography.title.title5)};
`;

export const PreviewDescription = styled.p`
  margin: 0;
  color: ${colors.gray[700]};
  white-space: pre-wrap;
  ${setTypography(typography.paragraph.p5)};
`;
