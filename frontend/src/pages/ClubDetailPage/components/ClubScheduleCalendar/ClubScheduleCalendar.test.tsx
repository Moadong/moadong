import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ClubCalendarEvent } from '@/types/club';
import ClubScheduleCalendar from './ClubScheduleCalendar';

/**
 * 공개 피드(ClubCalendarEventResult)가 실제로 내려주는 형태.
 * 백엔드가 반복·다중을 발생일로 펼쳐서 보내므로 recurrence·dates 필드가 없다.
 */
const PUBLIC_FEED: ClubCalendarEvent[] = [
  {
    id: 'r1:2026-03-04',
    title: '정기모임',
    start: '2026-03-04',
    source: 'CUSTOM',
    eventType: 'RECURRING',
    color: 'PINK',
  },
  {
    id: 'r1:2026-03-11',
    title: '정기모임',
    start: '2026-03-11',
    source: 'CUSTOM',
    eventType: 'RECURRING',
    color: 'PINK',
  },
  {
    id: 'm1:2026-03-20',
    title: '부스 준비',
    start: '2026-03-20',
    source: 'CUSTOM',
    eventType: 'MULTI',
    color: 'MINT',
  },
  {
    id: 'p1',
    title: 'MT',
    start: '2026-03-16',
    end: '2026-03-18',
    source: 'CUSTOM',
    eventType: 'PERIOD',
    color: 'YELLOW',
  },
];

// 캘린더는 항상 '이번 달'로 열리므로 기준 시각을 고정한다
beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 2, 13));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('ClubScheduleCalendar', () => {
  // 백엔드가 이미 펼친 발생일을 프론트가 다시 전개하면 recurrence가 없어 전부 사라졌다
  it('공개 피드의 반복·다중 일정을 그대로 표시한다', () => {
    render(<ClubScheduleCalendar events={PUBLIC_FEED} />);

    expect(screen.getAllByText('정기모임')).toHaveLength(2);
    expect(screen.getByText('3.4')).toBeInTheDocument();
    expect(screen.getByText('3.11')).toBeInTheDocument();
    expect(screen.getByText('부스 준비')).toBeInTheDocument();
    expect(screen.getByText('3.20')).toBeInTheDocument();
  });

  it('기간 일정은 시작~종료 한 줄로 표시한다', () => {
    render(<ClubScheduleCalendar events={PUBLIC_FEED} />);

    expect(screen.getByText('MT')).toBeInTheDocument();
    expect(screen.getByText('3.16 - 3.18')).toBeInTheDocument();
  });

  // 지난 일정의 달로 끌려가면 안 된다
  it('지난 일정만 있어도 이번 달로 연다', () => {
    render(
      <ClubScheduleCalendar
        events={[
          {
            id: 'old',
            title: '작년 행사',
            start: '2024-12-26',
            source: 'CUSTOM',
            eventType: 'SINGLE',
          },
        ]}
      />,
    );

    expect(screen.getByText('2026년 03월')).toBeInTheDocument();
    expect(screen.queryByText('2024년 12월')).not.toBeInTheDocument();
  });

  it('연동 일정을 불러오는 동안 캘린더 자리에 스피너를 보여준다', () => {
    render(<ClubScheduleCalendar events={[]} isLoading />);

    expect(screen.getByRole('status', { name: '로딩 중' })).toBeInTheDocument();
    // 로딩 중에 '일정 없음'이 먼저 스치면 안 된다
    expect(
      screen.queryByText('곧 새로운 일정이 업데이트될 예정이에요'),
    ).not.toBeInTheDocument();
  });

  it('이번 달에 일정이 없으면 이번 달 기준으로 안내한다', () => {
    render(
      <ClubScheduleCalendar
        events={[
          {
            id: 'old',
            title: '작년 행사',
            start: '2024-12-26',
            source: 'CUSTOM',
            eventType: 'SINGLE',
          },
        ]}
      />,
    );

    expect(screen.getByText('이번 달 일정이 없어요')).toBeInTheDocument();
  });

  it('다른 달로 이동하면 이번 달 문구를 쓰지 않는다', () => {
    render(
      <ClubScheduleCalendar
        events={[
          {
            id: 'old',
            title: '작년 행사',
            start: '2024-12-26',
            source: 'CUSTOM',
            eventType: 'SINGLE',
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '다음 달' }));

    expect(
      screen.getByText('이 달에 등록된 일정이 없어요'),
    ).toBeInTheDocument();
    expect(screen.queryByText('이번 달 일정이 없어요')).not.toBeInTheDocument();
  });

  it('일정이 없으면 안내 문구를 보여준다', () => {
    render(<ClubScheduleCalendar events={[]} />);

    expect(
      screen.getByText('곧 새로운 일정이 업데이트될 예정이에요'),
    ).toBeInTheDocument();
  });
});
