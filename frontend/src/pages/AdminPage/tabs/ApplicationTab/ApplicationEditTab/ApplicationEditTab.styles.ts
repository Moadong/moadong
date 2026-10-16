import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

export const FormTitle = styled.input`
  width: 100%;
  padding: 10px 12px;
  align-items: center;
  border-radius: 10px;
  background: ${colors.gray[100]};
  ${setTypography(typography.etc.bold28)}
  border: none;
  outline: none;
  margin: 35px 0px;

  &::placeholder {
    color: ${colors.gray[500]};
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 83px;
`;

export const AddQuestionButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${colors.gray[500]};
  ${setTypography(typography.paragraph.p5)}
  background: ${colors.base.white};
  color: ${colors.gray[800]};
  margin-bottom: 60px;
  cursor: pointer;
`;

export const QuestionDivider = styled.hr`
  margin-top: 40px;
  margin-bottom: 40px;
  border: none;
  border-top: 1px solid ${colors.gray[400]};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const submitButton = styled.button`
  padding: 10px 56px;
  background-color: ${colors.primary[900]};
  border-radius: 10px;
  border: none;
  color: ${colors.base.white};
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.4px;
  transition: background-color 0.2s;
  margin: 50px 0;

  &:hover {
    background-color: ${colors.primary[800]};
    animation: pulse 0.4s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ChangeButtonWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  height: 33px;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 0 0 1px ${colors.gray[400]} inset;
  width: fit-content;
`;

export const ApplicationFormChangeButton = styled.button<{ $active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  padding: 8px 12px;
  white-space: nowrap;
  color: ${colors.gray[700]};
  border: 0px;
  background: transparent;
  align-self: stretch;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.$active &&
    css`
      box-shadow:
        0 0 0 1px ${colors.primary[900]} inset,
        0 1px 2px 0 rgba(0, 0, 0, 0.2);
      background: ${colors.primary[500]};
      color: ${colors.primary[900]};
    `}

  ${setTypography(typography.button.button2)}
`;

export const ExternalApplicationFormContainer = styled.div`
  display: flex;
  padding: 6px 8px;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  background: ${colors.gray[100]};
`;

export const ExternalApplicationFormTitle = styled.div`
  display: inline-flex;
  height: 32px;
  padding: 6px 14px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${colors.base.white};
  ${setTypography(typography.paragraph.p2)}
`;

export const ExternalApplicationFormLinkInput = styled.input`
  background-color: transparent;
  border: none;
  ${setTypography(typography.paragraph.p6)}
  outline: none;
  width: 100%;
  &::placeholder {
    color: ${colors.gray[600]};
  }
`;

export const ExternalApplicationFormHint = styled.div`
  color: ${colors.gray[600]};
  ${setTypography(typography.paragraph.p7)}
  margin-top: 8px;
  margin-left: 4px;
`;

export const AiLoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${Z_INDEX.overlay};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.5);
`;

export const AiLoadingText = styled.p`
  ${setTypography(typography.paragraph.p2)};
  color: ${colors.base.white};
`;

export const AiDraftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AiDraftRemaining = styled.span`
  font-size: 12px;
  color: ${colors.gray[700]};
  white-space: nowrap;
`;

export const AiDraftButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 33px;
  padding: 0 12px;
  border: 1px solid var(--Main-Primary-900, #ff5414);
  border-radius: 6px;
  background-color: #fff;
  color: var(--Main-Primary-900, #ff5414);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
