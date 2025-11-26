import styled, { css } from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

const primary = 'rgba(255, 84, 20, 0.8)';
const primaryHover = 'rgba(255, 84, 20, 0.95)';
const white = '#fff';
const gray = 'rgba(0,0,0,0.5)';
const disabledGray = 'rgba(0,0,0,0.2)';
const inputBg = 'rgba(0,0,0,0.05)';
const inputDisabledBg = '#DFDFDF';

/* 재사용 블록 */
const selected = css`
  background-color: ${primary} !important;
  color: ${white} !important;
`;
const selectedHover = css`
  background-color: ${primaryHover};
  color: ${white};
`;
const cellBase = css`
  border-radius: 6px;
  transition:
    background-color 0.08s ease,
    color 0.08s ease;
`;

export const Tidle = styled.p`
  font-size: 1.375rem;
`;

export const DatepickerContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  /* 달력 루트 */
  .react-datepicker {
    border: none;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: inline-flex;
    align-items: stretch;
    width: auto;
  }

  /* 달력/시간 레이아웃 */
  .react-datepicker__month-container {
    flex: 1 1 auto;
  }
  .react-datepicker__time-container {
    flex: 0 0 120px;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    background: ${white};
  }

  /* 헤더 영역 */
  .react-datepicker__header {
    padding: 0 0 10px;
    border: none;
    background: ${white};
  }
  .react-datepicker__header-custom {
    background: ${primary};
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .react-datepicker__current-month {
    color: ${white};
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
    color: ${white};
  }
  .react-datepicker__navigation--previous--custom {
    left: 10px;
  }
  .react-datepicker__navigation--next--custom {
    right: 10px;
  }

  /* 잡다한 것 */
  .react-datepicker__triangle {
    display: none;
  }
  .react-datepicker__tab-loop {
    position: absolute;
  }

  /* 요일/날짜 정렬 */
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

  /* 입력 필드 */
  .react-datepicker__input-container input {
    width: 100%;
    max-width: 270px;
    height: 45px;
    border: none;
    border-radius: 6px;
    color: ${gray};
    background: ${inputBg};
    font-size: 1.125rem;
    padding: 12px 20px;
    cursor: pointer;
    transition:
      background-color 0.1s ease,
      color 0.1s ease;
    &:focus {
      outline: none;
      ${selected};
    }
  }

  /* 비활성화 입력 필드 */
  .react-datepicker__input-container input:disabled {
    background: ${inputDisabledBg};
    color: ${disabledGray};
  }

  /*  날짜 셀 스타일  */
  .react-datepicker__day {
    ${cellBase};
  }

  /* 기본 hover */
  .react-datepicker__day:hover {
    background: rgba(255, 84, 20, 0.12);
  }

  /* 선택된 날짜만 */
  .react-datepicker__day--selected {
    ${selected};
  }

  /* 선택된 날짜 hover */
  .react-datepicker__day--selected:hover {
    ${selectedHover};
  }

  .react-datepicker__day--keyboard-selected {
    background: transparent;
    color: inherit;
  }

  /* 비활성 날짜 */
  .react-datepicker__day--disabled,
  .react-datepicker__day--outside-month {
    opacity: 0.45;
    cursor: default;
  }
  .react-datepicker__day--disabled:hover,
  .react-datepicker__day--outside-month:hover {
    background: transparent;
  }

  /* 시간 패널 */
  .react-datepicker__time-container .react-datepicker__header {
    background: ${white};
    padding: 10px 0;
  }
  .react-datepicker-time__header {
    font-weight: 700;
    font-size: 16px;
    color: #111;
  }

  .react-datepicker__time {
    background: ${white};
  }
  .react-datepicker__time-box {
    width: 100%;
  }
  .react-datepicker__time-list {
    padding: 4px 0;
  }

  .react-datepicker__time-list-item {
    ${cellBase};
    height: 40px;
    line-height: 24px;
    margin: 0;
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 84, 20, 0.12);
    }

    &--selected {
      ${selected};

      &:hover {
        ${selectedHover};
      }
    }
  }
`;
