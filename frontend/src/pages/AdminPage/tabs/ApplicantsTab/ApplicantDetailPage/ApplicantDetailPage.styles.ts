import styled from 'styled-components';
import * as ApplicationFormPageStyles from '@/pages/ApplicationFormPage/ApplicationFormPage.styles';
import DropdownArrow from '@/assets/images/icons/applicant_drop.svg';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 58px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    align-items: flex-start;
  }
`;

export const ApplicantContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 240px;
  width: 82%;
  height: 100%;
  border: none;
  border-radius: 10px;
  background: var(--f5, #f5f5f5);

  select {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    border: none;
    background-color: transparent;

    background-image: url(${DropdownArrow});
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 11px 11px;

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding: 20px;
  }
`;

export const StatusSelect = styled.select<{ $backgroundColor: string }>`
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  width: 18%;
  height: 100%;
  cursor: pointer;

  color: var(--4B, #4b4b4b);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;

  background-color: ${(props) => props.$backgroundColor};

  background-image: url(${DropdownArrow});
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 30px;
  background-size: 9px 9px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MemoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
  padding: 12px 12px;
  min-height: 100px;
  background: var(--f5, #f5f5f5);
  border-radius: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MemoLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: 60px;
  height: 32px;
  background: #fff;
  border-radius: 10px;
  padding: 6px 14px;
  color: var(--, #111);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;

  &::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 30%;
    height: 40%;
    width: 4px;
    height: 14px;
    background: #d9d9d9;
  }
`;

export const MemoTextarea = styled.textarea`
  flex: 1;
  min-height: 80px;
  border: none;
  border-radius: 10px;
  background: var(--f5, #f5f5f5);
  padding: 12px;
  resize: none;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: var(--4B, #4b4b4b);

  &:focus {
    outline: none;
  }
`;

export const ApplicantInfoContainer = styled.div`
  display: block;
  width: 100%;
  padding: 10px 30px;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
`;

export const QuestionsWrapper = styled(
  ApplicationFormPageStyles.QuestionsWrapper,
)`
  cursor: default;
`;

export const NavigationButton = styled.img`
  cursor: pointer;
`;
