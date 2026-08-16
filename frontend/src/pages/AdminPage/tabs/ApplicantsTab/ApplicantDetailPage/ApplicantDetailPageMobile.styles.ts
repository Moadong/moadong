import styled from 'styled-components';
import PrevApplicant from '@/assets/images/icons/prev_applicant.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${colors.base.white};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
  height: 48px;
  background: ${colors.base.white};
  border-bottom: 1px solid ${colors.gray[300]};
  box-sizing: border-box;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const BackIcon = styled(PrevApplicant)`
  width: 24px;
  height: 24px;
  color: ${colors.base.black};

  & circle {
    display: none;
  }
  & path {
    stroke: currentColor;
    stroke-width: 2;
  }
`;

export const HeaderTitle = styled.h1`
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
  letter-spacing: -0.02em;
`;

export const HeaderSpacer = styled.div`
  width: 24px;
  height: 24px;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 20px;
  box-sizing: border-box;
`;

export const StatusTabRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 32px;
`;

export const StatusTab = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  height: 32px;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  background: ${({ $isSelected }) =>
    $isSelected
      ? `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), ${colors.gray[800]}`
      : colors.gray[100]};
  ${({ $isSelected }) =>
    $isSelected
      ? setTypography(typography.button.button1)
      : setTypography(typography.paragraph.p6)}
  color: ${({ $isSelected }) =>
    $isSelected ? colors.base.white : colors.gray[600]};
  letter-spacing: -0.02em;
  text-align: center;
`;

export const MemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 18px;
  width: 100%;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[200]};
  border-radius: 14px;
  box-sizing: border-box;
`;

export const MemoLabel = styled.span`
  ${setTypography(typography.paragraph.p7)}
  font-weight: 500;
  letter-spacing: -0.02em;
  color: ${colors.gray[600]};
`;

export const MemoInput = styled.input`
  flex: 1;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  ${setTypography(typography.paragraph.p3)}
  letter-spacing: -0.02em;
  color: ${colors.gray[900]};

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.gray[100]};
  flex-shrink: 0;
`;

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
  box-sizing: border-box;
`;
