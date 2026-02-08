import styled, { css } from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { colors } from '@/styles/theme/colors';

/* 공통 블록 */
const selected = css`
  background-color: ${colors.primary[800]} !important;
  color: ${colors.base.white} !important;
`;

const selectedHover = css`
  background-color: ${colors.primary[800]} !important;
  color: ${colors.base.white};
`;

const cellBase = css`
  border-radius: 6px;
  transition:
    background-color 0.08s ease,
    color 0.08s ease;
`;

/** Calendar.styles.ts 역할을 그대로 대체 */
export const DatePickerScope = styled.div`
  /* 달력 루트 */
  .react-datepicker {
    border: none;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 8px rgba(172, 172, 172, 0.5);
    display: inline-flex;
    align-items: flex-start;
    width: auto;
  }

  /* 헤더 */
  .react-datepicker__header {
    padding: 0 0 10px;
    border: none;
    background: ${colors.base.white};
  }

  .react-datepicker__header-custom {
    background: ${colors.primary[800]};
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .react-datepicker__current-month {
    color: ${colors.base.white};
    font-weight: 600;
    font-size: 18px;
  }

  /* 네비게이션 */
  .react-datepicker__navigation--custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 25px;
    color: ${colors.base.white};
  }

  .react-datepicker__navigation--previous--custom {
    left: 10px;
  }

  .react-datepicker__navigation--next--custom {
    right: 10px;
  }

  /* 기타 */
  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__tab-loop {
    position: absolute;
  }

  /* 월 / 요일 */
  .react-datepicker__month {
    padding: 0 20px;
  }

  .react-datepicker__week {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    gap: 12px;
  }

  .react-datepicker__day-name {
    font-weight: 600;
    font-size: 14px;
  }

  /* 날짜 셀 */
  .react-datepicker__day {
    ${cellBase};
  }

  .react-datepicker__day:hover {
    background: rgba(255, 84, 20, 0.12);
  }

  .react-datepicker__day--selected {
    ${selected};
  }

  .react-datepicker__day--selected:hover {
    ${selectedHover};
  }

  .react-datepicker__day--keyboard-selected {
    background: transparent;
    color: inherit;
  }

  .react-datepicker__day--disabled,
  .react-datepicker__day--outside-month {
    opacity: 0.45;
    cursor: default;
  }

  .react-datepicker__day--disabled:hover,
  .react-datepicker__day--outside-month:hover {
    background: transparent;
  }
`;
