import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import 'react-datepicker/dist/react-datepicker.css';

const cell = css`
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

const selected = css`
  background-color: ${colors.primary[800]} !important;
  color: ${colors.base.white} !important;
  font-weight: 600;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &[data-disabled='true'] {
    opacity: 0.6;
    pointer-events: none;
  }

  /* root */
  .react-datepicker {
    border: none;
    border-radius: 0;
    overflow: hidden;
  }

  .react-datepicker__triangle,
  .react-datepicker__navigation {
    display: none !important;
  }

  /* header */
  .react-datepicker__header {
    display: none !important;
  }

  .react-datepicker__current-month {
    display: none !important;
  }

  /* calendar */
  .react-datepicker__month {
    padding: 0 20px;
  }

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

  .react-datepicker__week {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;
  }

  .react-datepicker__day {
    ${cell};

    &:hover {
      background-color: ${colors.primary[500]} !important;
    }
  }

  .react-datepicker__day--selected {
    ${selected};

    &:hover {
      ${selected};
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
