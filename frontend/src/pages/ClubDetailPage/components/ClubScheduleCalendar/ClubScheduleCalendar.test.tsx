import { render, screen, fireEvent } from '@testing-library/react';
import ClubScheduleCalendar from './ClubScheduleCalendar';
import {
  buildDateKeyFromDate,
  formatMonthLabel,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import '@testing-library/jest-dom';

// Mock calendarSyncUtils if needed, or provide simple implementations for tests
jest.mock('@/utils/calendarSyncUtils', () => ({
  __esModule: true,
  ...jest.requireActual('@/utils/calendarSyncUtils'),
  formatMonthLabel: jest.fn((date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }),
  formatSelectedDate: jest.fn((dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return `${month}월 ${day}일`;
  }),
  WEEKDAY_LABELS: ['일', '월', '화', '수', '목', '금', '토'],
}));

describe('ClubScheduleCalendar', () => {
  const mockEvents = [
    {
      id: '1',
      title: '첫 번째 이벤트',
      start: '2026-04-10T10:00:00Z',
      end: '2026-04-10T11:00:00Z',
      description: '설명 1',
      url: 'http://example.com/1',
    },
    {
      id: '2',
      title: '두 번째 이벤트',
      start: '2026-04-10T12:00:00Z',
      end: '2026-04-10T13:00:00Z',
      description: '설명 2',
      url: 'http://example.com/2',
    },
    {
      id: '3',
      title: '다른 달 이벤트',
      start: '2026-05-15T14:00:00Z',
      end: '2026-05-15T15:00:00Z',
      description: '설명 3',
      url: 'http://example.com/3',
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    // Set a fixed date for consistent testing
    jest.setSystemTime(new Date('2026-04-12T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('이벤트가 없을 때 "등록된 행사 일정이 없습니다."를 렌더링해야 한다', () => {
    render(<ClubScheduleCalendar events={[]} />);
    expect(
      screen.getByText('등록된 행사 일정이 없습니다.'),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('이전 달')).not.toBeInTheDocument();
  });

  it('이벤트가 있을 때 캘린더와 일정 목록을 렌더링해야 한다', () => {
    render(<ClubScheduleCalendar events={mockEvents} />);
    expect(screen.getByText('2026년 4월')).toBeInTheDocument();
    expect(screen.getByLabelText('이전 달')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 달')).toBeInTheDocument();
    expect(screen.getByText('첫 번째 이벤트')).toBeInTheDocument(); // Initial selected date has event
  });

  it('월 이동 버튼 클릭 시 월이 변경되어야 한다', () => {
    render(<ClubScheduleCalendar events={mockEvents} />);

    const prevMonthButton = screen.getByLabelText('이전 달');
    fireEvent.click(prevMonthButton);
    expect(screen.getByText('2026년 3월')).toBeInTheDocument();

    const nextMonthButton = screen.getByLabelText('다음 달');
    fireEvent.click(nextMonthButton); // Back to April
    fireEvent.click(nextMonthButton); // To May
    expect(screen.getByText('2026년 5월')).toBeInTheDocument();
  });

  it('날짜 클릭 시 선택된 날짜와 일정이 업데이트되어야 한다', () => {
    render(<ClubScheduleCalendar events={mockEvents} />);

    // Initially, April 10th has events
    expect(screen.getByText('4월 10일')).toBeInTheDocument();
    expect(screen.getByText('첫 번째 이벤트')).toBeInTheDocument();

    // Click on a day without events (e.g., April 11th)
    const day11 = screen.getByRole('button', { name: /^11$/ }); // Day number 11
    fireEvent.click(day11);

    expect(screen.getByText('4월 11일')).toBeInTheDocument();
    expect(
      screen.getByText('선택한 날짜에 등록된 일정이 없습니다.'),
    ).toBeInTheDocument();
  });
});
