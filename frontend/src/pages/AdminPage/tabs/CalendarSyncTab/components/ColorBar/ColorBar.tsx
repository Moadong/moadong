import {
  CALENDAR_EVENT_COLOR_ORDER,
  CALENDAR_EVENT_COLORS,
} from '@/constants/calendarEventColors';
import type { CalendarEventColor } from '@/types/club';
import * as Styled from './ColorBar.styles';

interface ColorBarProps {
  value: CalendarEventColor;
  onChange: (color: CalendarEventColor) => void;
}

const ColorBar = ({ value, onChange }: ColorBarProps) => (
  <Styled.Container role='radiogroup' aria-label='일정 색상 선택'>
    {CALENDAR_EVENT_COLOR_ORDER.map((color) => (
      <Styled.ColorChip
        key={color}
        type='button'
        role='radio'
        aria-checked={value === color}
        aria-label={color}
        $color={CALENDAR_EVENT_COLORS[color].main}
        $selected={value === color}
        onClick={() => onChange(color)}
      />
    ))}
  </Styled.Container>
);

export default ColorBar;
