import CalendarLinkButton, {
  type CalendarLinkStatus,
} from '../CalendarLinkButton/CalendarLinkButton';
import EventCheckItem from '../EventCheckItem/EventCheckItem';
import * as Styled from './CalendarLinkCard.styles';

export interface CalendarLinkEvent {
  id: string;
  /** 'YYYY. MM. DD' 형식. 날짜가 없는 일정은 제목만 보여준다 */
  date?: string;
  title: string;
}

interface CalendarLinkCardProps {
  title: string;
  description: string;
  status: CalendarLinkStatus;
  onButtonClick: () => void;
  /** 연동된 뒤 목록으로 보여줄 일정 */
  events?: CalendarLinkEvent[];
  checkedEventIds?: string[];
  onToggleEvent?: (eventId: string) => void;
}

const CalendarLinkCard = ({
  title,
  description,
  status,
  onButtonClick,
  events = [],
  checkedEventIds = [],
  onToggleEvent,
}: CalendarLinkCardProps) => (
  <Styled.Card>
    <Styled.Header>
      <Styled.Title>{title}</Styled.Title>
      <Styled.DescriptionRow>
        <Styled.Description>{description}</Styled.Description>
        <CalendarLinkButton status={status} onClick={onButtonClick} />
      </Styled.DescriptionRow>
    </Styled.Header>

    {events.length > 0 && (
      <Styled.EventList>
        {events.map((event) => (
          <EventCheckItem
            key={event.id}
            checked={checkedEventIds.includes(event.id)}
            onChange={() => onToggleEvent?.(event.id)}
            date={event.date}
            title={event.title}
          />
        ))}
      </Styled.EventList>
    )}
  </Styled.Card>
);

export default CalendarLinkCard;
