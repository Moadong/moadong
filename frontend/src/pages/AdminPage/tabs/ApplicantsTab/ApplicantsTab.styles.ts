import styled from 'styled-components';
import checkIcon from '@/assets/images/icons/checkBox.svg';
import hoverDeleteIcon from '@/assets/images/icons/applicant_delete_hover.svg';
import disabledDeleteIcon from '@/assets/images/icons/applicant_delete_disabled.svg';

export const ApplicationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const ApplicationTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

export const SemesterSelect = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 16px;
`;

// 지원현황
export const SummaryWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

export const SummaryCard = styled.div<{ bgColor: string }>`
  flex: 1;
  background: ${({ bgColor }) => bgColor};
  border-radius: 10px;
  padding: 32px 0;
  text-align: center;
`;

export const SummaryLabel = styled.div`
  font-size: 18px;
  color: #888;
`;

export const SummaryValue = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-top: 8px;
`;

export const SummaryPeople = styled.span`
  font-size: 20px;
  font-weight: 400;
  margin-left: 2px;
`;

// 지원자 목록 스타일
export const ApplicantListWrapper = styled.div``;

export const ApplicantListTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const ApplicantListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 8px;
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Arrow = styled.img<{ width?: number; height?: number }>`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: ${({ width }) => (width ? `${width}px` : '12px')};
  height: ${({ height }) => (height ? `${height}px` : '12px')};
  pointer-events: none;
`;

export const VerticalLine = styled.div`
  width: 1px;
  height: auto;
  background-color: #dcdcdc;
  margin: 8px 4px;
`;

export const StatusSelect = styled.select`
  height: 30px;
  border: 1px solid #dcdcdc;
  background: #fff;
  border-radius: 55px;
  padding: 0px 22px 0px 8px;
  margin: 5px 0px 5px 0px;
  font-weight: 700;
  color: ${({ disabled }) => (disabled ? '#000' : '#DCDCDC')};

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:disabled:hover {
    background: #f5f5f5;
  }
`;

export const ApplicantFilterSelect = styled.select`
  height: 35px;
  padding: 4px 32px 4px 14px;
  border-radius: 8px;
  border: none;
  background: var(--f5, #f5f5f5);
  font-size: 16px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:hover {
    background: #ebebeb;
  }
`;

export const DeleteButton = styled.img<{ disabled?: boolean }>`
  ${({ disabled }) =>
    !disabled
      ? `content: url(${disabledDeleteIcon});`
      : `
        &:hover {
          content: url(${hoverDeleteIcon});
        }
    `};
`;

export const ApplicantSearchBox = styled.input`
  margin-left: auto;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 240px;
  font-size: 16px;
`;

export const ApplicantTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

export const ApplicantTableHeaderWrapper = styled.thead`
  border-top: 1px solid #c5c5c5;
  border-bottom: 1px solid var(--light-line, #dcdcdc);
  background: #fafafa;
`;

export const ApplicantTableHeader = styled.th<{
  width?: number | string;
  borderLeft?: boolean;
  isMemo?: boolean;
}>`
  position: relative;
  background: #fafafa;
  padding: 12px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  color: var(--78, #787878);
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  text-align: ${({ isMemo }) => (isMemo ? 'left' : 'center')};
  padding-left: ${({ isMemo }) => (isMemo ? '30px' : '8px')};

  ${({ borderLeft }) =>
    borderLeft &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 30%;
      height: 40%;
      width: 1px;
      background: #DCDCDC;
    }
  `}
`;

export const ApplicantTableRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  text-align: center;

  &:hover {
    background: #f7faff;
  }
`;

export const ApplicantTableCol = styled.td<{ isMemo?: boolean }>`
  padding: 12px 8px;
  font-size: 16px;
  text-align: ${({ isMemo }) => (isMemo ? 'left' : 'center')};
  padding-left: ${({ isMemo }) => (isMemo ? '30px' : '8px')};

  ${({ isMemo }) =>
    isMemo &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0; /* 테이블 셀에서 text-overflow 작동을 위해 필요 */
  `}
`;

export const ApplicantTableCheckbox = styled.input.attrs({ type: 'checkbox' })`
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid #dcdcdc;
  background-color: #fff;
  cursor: pointer;

  &:checked {
    border: 0px;
    background: #ffe7de url(${checkIcon}) center/24px 24px no-repeat;
  }
`;

export const ApplicantAllSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ApplicantAllSelectArrow = styled.img`
  position: absolute;
  right: -1px;
  width: 16px;
  height: 16px;
  object-fit: none;
  cursor: pointer;
`;

export const ApplicantTableAllSelectCheckbox = styled.input.attrs({
  type: 'checkbox',
})`
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid #787878;
  background-color: #fff;
  cursor: pointer;

  &:checked {
    border: 0px;
    background: #ffe7de url(${checkIcon}) center/24px 24px no-repeat;
  }
`;

export const ApplicantStatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 500;
  font-size: 15px;
  background: ${({ status }) =>
    status === '서류검토'
      ? '#E6F4FB'
      : status === '면접예정'
        ? '#E6FBF0'
        : status === '합격'
          ? '#F5F5F5'
          : '#eee'};
  color: ${({ status }) => (status === '합격' ? '#888' : '#222')};
`;
