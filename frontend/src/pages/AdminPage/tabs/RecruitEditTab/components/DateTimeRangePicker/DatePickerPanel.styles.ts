import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import 'react-datepicker/dist/react-datepicker.css';

const commonCellLayout = css`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  transition:
    background-color 0.08s ease,
    color 0.08s ease;
`;

const activeDayStyle = css`
  background-color: ${colors.primary[800]} !important;
  color: ${colors.base.white} !important;
  font-weight: 600;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .react-datepicker {
    border: none;
    border-radius: 0;
    overflow: hidden;
  }

  .react-datepicker__triangle,
  .react-datepicker__navigation,
  .react-datepicker__header,
  .react-datepicker__curront-month {
    display: none !important;
  }

  /* 달력 본체 영역 */
  .react-datepicker__month {
    margin-top: 10px;
    padding: 0 20px;
  }

  /* 요일명 영역 */
  .react-datepicker__day-names {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding-top: 12px;
  }

  .react-datepicker__day-name {
    font-size: 14px;
    font-weight: 600;
  }

  /* 주(Week) 행 */
  .react-datepicker__week {
    display: flex;
    gap: 12px;
    padding-bottom: 10px;
  }

  /* 개별 날짜 셀 */
  .react-datepicker__day {
    ${commonCellLayout};

    &:hover {
      background-color: ${colors.primary[500]} !important;
    }
  }

  .react-datepicker__day--selected {
    ${activeDayStyle};

    &:hover {
      ${activeDayStyle};
    }
  }

  .react-datepicker__day--keyboard-selected {
    background: transparent;
    color: inherit;
  }

  .react-datepicker__day--disabled,
  .react-datepicker__day--outside-month {
    opacity: 0.45;
    cursor: default;

    &:hover {
      background: transparent;
    }
  }
`;
