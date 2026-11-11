import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  background: ${colors.base.white};
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
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
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
    $isSelected ? colors.gray[925] : colors.gray[100]};
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
  box-shadow: inset 0 0 0 1px ${colors.gray[200]};
  /* 강제 색상(고대비) 모드는 box-shadow를 지우므로, 평소엔 안 보이고 그 모드에서만 테두리로 그려지는 outline을 둔다 */
  outline: 1px solid transparent;
  outline-offset: -1px;
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
  padding: 16px 20px 19px;
  box-sizing: border-box;
`;
