import type { StatisticsDateRange } from '../utils/statisticsDate';
import * as Styled from '../StatisticsTab.styles';

interface PeriodSelectorProps {
  range: StatisticsDateRange;
  activePreset: number | null;
  validationMessage: string | null;
  onPresetSelect: (days: number) => void;
  onRangeChange: (range: StatisticsDateRange) => void;
}

const PRESET_DAYS = [7, 30] as const;

const PeriodSelector = ({
  range,
  activePreset,
  validationMessage,
  onPresetSelect,
  onRangeChange,
}: PeriodSelectorProps) => {
  return (
    <Styled.PeriodSelector>
      <Styled.QuickButtonGroup>
        {PRESET_DAYS.map((days) => (
          <Styled.QuickButton
            key={days}
            type='button'
            $active={activePreset === days}
            onClick={() => onPresetSelect(days)}
          >
            최근 {days}일
          </Styled.QuickButton>
        ))}
      </Styled.QuickButtonGroup>

      <Styled.DateInputGroup>
        <Styled.DateInput
          type='date'
          value={range.from}
          onChange={(event) =>
            onRangeChange({ ...range, from: event.target.value })
          }
          aria-label='통계 시작일'
        />
        <Styled.DateSeparator>~</Styled.DateSeparator>
        <Styled.DateInput
          type='date'
          value={range.to}
          onChange={(event) =>
            onRangeChange({ ...range, to: event.target.value })
          }
          aria-label='통계 종료일'
        />
      </Styled.DateInputGroup>

      {validationMessage && (
        <Styled.ValidationText>{validationMessage}</Styled.ValidationText>
      )}
    </Styled.PeriodSelector>
  );
};

export default PeriodSelector;
