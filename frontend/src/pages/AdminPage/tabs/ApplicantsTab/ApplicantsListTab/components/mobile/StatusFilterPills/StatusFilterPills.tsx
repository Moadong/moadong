import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './StatusFilterPills.styles';

const ALL = 'ALL' as const;
export type FilterValue = typeof ALL | ApplicationStatus;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: ALL, label: '전체' },
  { value: ApplicationStatus.SUBMITTED, label: mapStatusToGroup(ApplicationStatus.SUBMITTED).label },
  { value: ApplicationStatus.INTERVIEW_SCHEDULED, label: mapStatusToGroup(ApplicationStatus.INTERVIEW_SCHEDULED).label },
  { value: ApplicationStatus.ACCEPTED, label: mapStatusToGroup(ApplicationStatus.ACCEPTED).label },
  { value: ApplicationStatus.DECLINED, label: mapStatusToGroup(ApplicationStatus.DECLINED).label },
];

interface StatusFilterPillsProps {
  selected: FilterValue[];
  onChange: (selected: FilterValue[]) => void;
}

const StatusFilterPills = ({ selected, onChange }: StatusFilterPillsProps) => {
  const handleClick = (value: FilterValue) => {
    if (value === ALL) {
      onChange([ALL]);
      return;
    }

    const withoutAll = selected.filter((v) => v !== ALL);
    const isAlreadySelected = withoutAll.includes(value);

    if (isAlreadySelected) {
      const next = withoutAll.filter((v) => v !== value);
      onChange(next.length === 0 ? [ALL] : next);
    } else {
      onChange([...withoutAll, value]);
    }
  };

  return (
    <Styled.Container>
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive =
          value === ALL
            ? selected.includes(ALL) || selected.length === 0
            : selected.includes(value);

        return (
          <Styled.Pill key={value} $active={isActive} onClick={() => handleClick(value)}>
            {label}
          </Styled.Pill>
        );
      })}
    </Styled.Container>
  );
};

export default StatusFilterPills;
