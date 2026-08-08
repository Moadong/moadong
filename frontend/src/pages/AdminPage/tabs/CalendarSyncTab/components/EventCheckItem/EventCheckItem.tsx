import CheckedIcon from '@/assets/images/icons/calendar_sync_checkbox_checked.svg?react';
import * as Styled from './EventCheckItem.styles';

interface EventCheckItemProps {
  checked: boolean;
  onChange: () => void;
  /** 'YYYY. MM. DD' 형식. 날짜가 없는 일정은 제목만 보여준다 */
  date?: string;
  title: string;
}

const EventCheckItem = ({
  checked,
  onChange,
  date,
  title,
}: EventCheckItemProps) => (
  <Styled.Item>
    <Styled.Input type='checkbox' checked={checked} onChange={onChange} />
    {checked ? (
      <Styled.CheckedBox aria-hidden>
        <CheckedIcon />
      </Styled.CheckedBox>
    ) : (
      <Styled.Box aria-hidden />
    )}
    <Styled.Label>{date ? `${date}  ${title}` : title}</Styled.Label>
  </Styled.Item>
);

export default EventCheckItem;
