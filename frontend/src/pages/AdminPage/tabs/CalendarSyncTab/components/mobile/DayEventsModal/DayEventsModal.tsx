import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import {
  CALENDAR_EVENT_COLORS,
  DEFAULT_CALENDAR_EVENT_COLOR,
} from '@/constants/calendarEventColors';
import { useDeleteCustomCalendarEvent } from '@/hooks/Queries/useCustomCalendarEvents';
import type { DeleteScope } from '@/types/club';
import {
  buildDateKeyFromDate,
  formatMonthDayWeekday,
  formatShortMonthDay,
} from '@/utils/calendarSyncUtils';
import type { CalendarEventOccurrence } from '@/utils/eventOccurrences';
import DeleteScopeSheet from '../DeleteScopeSheet/DeleteScopeSheet';
import SwipeableEventRow from '../SwipeableEventRow/SwipeableEventRow';
import * as Styled from './DayEventsModal.styles';

interface DayEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey: string;
  occurrences: CalendarEventOccurrence[];
  onAddEvent: () => void;
}

/** 기간 일정은 `3.16 - 3.20`, 그 외에는 해당 날짜만 표시한다. */
const formatOccurrenceDate = (occurrence: CalendarEventOccurrence) => {
  const { event } = occurrence;
  if (event.eventType === 'PERIOD' && event.end) {
    return `${formatShortMonthDay(event.start)} - ${formatShortMonthDay(event.end)}`;
  }
  return formatShortMonthDay(occurrence.dateKey);
};

const DayEventsModal = ({
  isOpen,
  onClose,
  dateKey,
  occurrences,
  onAddEvent,
}: DayEventsModalProps) => {
  const deleteMutation = useDeleteCustomCalendarEvent();
  const [pendingDelete, setPendingDelete] =
    useState<CalendarEventOccurrence | null>(null);

  const isToday = dateKey === buildDateKeyFromDate(new Date());

  const runDelete = (
    occurrence: CalendarEventOccurrence,
    scope?: DeleteScope,
  ) => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate(
      {
        eventId: occurrence.eventId,
        options: scope ? { scope, date: occurrence.dateKey } : undefined,
      },
      {
        onSuccess: () => setPendingDelete(null),
        onError: () => window.alert('일정 삭제에 실패했습니다.'),
      },
    );
  };

  // 반복 일정은 삭제 범위를, 그 외에는 삭제 여부를 시트에서 확인받는다
  const handleDelete = (occurrence: CalendarEventOccurrence) =>
    setPendingDelete(occurrence);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Styled.Body>
          <Styled.DateLabel>{formatMonthDayWeekday(dateKey)}</Styled.DateLabel>
          {isToday && <Styled.TodayLabel>오늘</Styled.TodayLabel>}

          {occurrences.length === 0 ? (
            <Styled.Empty>등록된 일정이 없습니다.</Styled.Empty>
          ) : (
            <Styled.EventList>
              {occurrences.map((occurrence) => {
                const palette =
                  CALENDAR_EVENT_COLORS[
                    occurrence.event.color ?? DEFAULT_CALENDAR_EVENT_COLOR
                  ];
                return (
                  <Styled.EventItem key={occurrence.occurrenceId}>
                    <SwipeableEventRow
                      onDelete={() => handleDelete(occurrence)}
                    >
                      <Styled.EventCard $back={palette.back}>
                        <Styled.ColorDot $color={palette.main} />
                        <Styled.EventTitle>
                          {occurrence.title}
                        </Styled.EventTitle>
                        <Styled.EventDate>
                          {formatOccurrenceDate(occurrence)}
                        </Styled.EventDate>
                      </Styled.EventCard>
                    </SwipeableEventRow>
                  </Styled.EventItem>
                );
              })}
            </Styled.EventList>
          )}

          <Styled.AddButton type='button' onClick={onAddEvent}>
            <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
              <path
                d='M7 1.5V12.5M1.5 7H12.5'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
              />
            </svg>
            일정을 추가하세요
          </Styled.AddButton>
        </Styled.Body>
      </Modal>

      {pendingDelete && (
        <DeleteScopeSheet
          isOpen
          onClose={() => setPendingDelete(null)}
          isDeleting={deleteMutation.isPending}
          showScopeOptions={pendingDelete.event.eventType === 'RECURRING'}
          onConfirm={(scope) =>
            runDelete(
              pendingDelete,
              pendingDelete.event.eventType === 'RECURRING' ? scope : undefined,
            )
          }
        />
      )}
    </>
  );
};

export default DayEventsModal;
