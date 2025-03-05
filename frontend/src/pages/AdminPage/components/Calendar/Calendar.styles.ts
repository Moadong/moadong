import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

const primaryColor = 'rgba(255, 84, 20, 0.8)';
const whiteColor = '#FFFFFF';
const grayColor = 'rgba(0, 0, 0, 0.5)';
const inputBgColor = 'rgba(0, 0, 0, 0.05)';

export const Tidle = styled.p`
  font-size: 1.375rem;
`;

export const DatepickerContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  /* 📌 공통 스타일 */
  .react-datepicker {
    border: none;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  /* 📌 선택된 날짜 스타일 */
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: ${primaryColor};
    color: ${whiteColor};
  }

  /* 📌 달력 내부 스타일 */
  .react-datepicker__month {
    padding: 0 20px;
  }

  .react-datepicker__header {
    padding: 0 0 10px 0;
    border: none;
    background-color: ${whiteColor};
  }

  /* 📌 커스텀 헤더 스타일 */
  .react-datepicker__header-custom {
    background-color: ${primaryColor};
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .react-datepicker__current-month {
    color: ${whiteColor};
    font-weight: 600;
    font-size: 18px;
  }

  /* 📌 이전/다음 버튼 스타일 */
  .react-datepicker__navigation--custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 25px;
    color: ${whiteColor};
  }

  .react-datepicker__navigation--previous--custom {
    left: 10px;
  }

  .react-datepicker__navigation--next--custom {
    right: 10px;
  }

  /* 📌 불필요한 요소 숨김 */
  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__tab-loop {
    position: absolute;
  }

  /* 📌 날짜 및 요일 스타일 */
  .react-datepicker__week {
    display: flex;
    gap: 12px;
    padding: 0 0 12px 0;
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: center;
    padding: 10px 0 0 0;
    gap: 12px;
  }

  .react-datepicker__day-name {
    font-weight: 600;
    font-size: 14px;
  }

  /* 📌 인풋 필드 스타일 */
  .react-datepicker__input-container input {
    width: 130px;
    height: 45px;
    border: none;
    border-radius: 6px;
    color: ${grayColor};
    background-color: ${inputBgColor};
    font-size: 1.125rem;
    padding: 12px 20px;
    cursor: pointer;
    transition:
      background-color 0.1s ease-in-out,
      color 0.1s ease-in-out;

    &:focus {
      outline: none;
      color: ${whiteColor};
      background-color: ${primaryColor};
    }
  }
`;
