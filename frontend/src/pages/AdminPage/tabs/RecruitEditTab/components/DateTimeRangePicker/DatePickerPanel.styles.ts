import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import 'react-datepicker/dist/react-datepicker.css';

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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &[data-disabled='true'] {
    opacity: 0.6;
    pointer-events: none;
  }

  /* react-datepicker root */
  .react-datepicker {
    border: none;
    border-radius: 0;
    overflow: hidden;
  }

  .react-datepicker__triangle {
    display: none;
  }

  /* header */
  .react-datepicker__header {
    padding: 0;
    margin: 0;
    border: none;
    background: ${colors.base.white};
    padding-bottom: 18px; /* header와 달력 사이 간격 */
  }

  .react-datepicker__header-custom {
    background: ${colors.primary[800]};
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
  }

  .react-datepicker__current-month {
    color: ${colors.base.white};
    font-weight: 600;
    font-size: 16px;
  }

  .react-datepicker__navigation--custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 22px;
    color: ${colors.base.white};
  }

  .react-datepicker__navigation--previous--custom {
    left: 10px;
  }

  .react-datepicker__navigation--next--custom {
    right: 10px;
  }

  /* calendar grid */
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
    gap: 12px;
    padding-top: 10px;
  }

  .react-datepicker__day-name {
    font-size: 14px;
    font-weight: 600;
  }

  .react-datepicker__day {
    ${cellBase};

    &:hover {
      background: ${colors.primary[500]};
    }
  }

  .react-datepicker__day--selected {
    ${selected};

    &:hover {
      ${selectedHover};
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

export const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.gray[700]};
`;
