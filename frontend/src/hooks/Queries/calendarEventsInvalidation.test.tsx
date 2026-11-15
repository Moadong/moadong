import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { queryKeys } from '@/constants/queryKeys';
import type { CustomCalendarEventInput } from '@/types/club';
import {
  useCreateCustomCalendarEvent,
  useDeleteCustomCalendarEvent,
  useUpdateCustomCalendarEvent,
} from './useCustomCalendarEvents';
import {
  useDisconnectGoogleCalendar,
  useSelectGoogleCalendar,
} from './useGoogleCalendar';
import {
  useHideCalendarEvent,
  useUnhideCalendarEvent,
} from './useHiddenCalendarEvents';
import {
  useApplyNotionDatabase,
  useDisconnectNotionCalendar,
} from './useNotionCalendar';

jest.mock('@/apis/calendarOAuth', () => ({
  selectGoogleCalendar: jest.fn().mockResolvedValue(undefined),
  disconnectGoogleCalendar: jest.fn().mockResolvedValue(undefined),
  disconnectNotionCalendar: jest.fn().mockResolvedValue(undefined),
  fetchNotionDatabasePages: jest.fn().mockResolvedValue({ items: [] }),
}));

jest.mock('@/apis/hiddenCalendarEvents', () => ({
  hideCalendarEvent: jest.fn().mockResolvedValue(undefined),
  unhideCalendarEvent: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/apis/customCalendarEvents', () => ({
  createCustomCalendarEvent: jest.fn().mockResolvedValue(undefined),
  updateCustomCalendarEvent: jest.fn().mockResolvedValue(undefined),
  deleteCustomCalendarEvent: jest.fn().mockResolvedValue(undefined),
}));

/** 공개 상세 페이지는 이름(`@이름`)과 id 어느 쪽으로도 캘린더 키를 만든다 */
const PUBLIC_CALENDAR_KEYS = [
  queryKeys.club.calendarEvents('abc123'),
  queryKeys.club.calendarEvents('@모아동'),
];

const setup = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  PUBLIC_CALENDAR_KEYS.forEach((key) => queryClient.setQueryData(key, []));
  queryClient.setQueryData(queryKeys.club.detail('abc123'), {});
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

const isInvalidated = (queryClient: QueryClient, key: readonly unknown[]) =>
  queryClient.getQueryState(key)?.isInvalidated;

const CUSTOM_EVENT_INPUT: CustomCalendarEventInput = {
  title: '정기 모임',
  start: '2026-11-06',
};

const MUTATIONS: [string, () => Promise<unknown>][] = [
  [
    '구글 캘린더 선택',
    () =>
      mutate(useSelectGoogleCalendar, { calendarId: 'c', calendarName: 'n' }),
  ],
  ['구글 캘린더 해제', () => mutate(useDisconnectGoogleCalendar, undefined)],
  ['노션 데이터베이스 적용', () => mutate(useApplyNotionDatabase, 'db1')],
  ['노션 캘린더 해제', () => mutate(useDisconnectNotionCalendar, undefined)],
  [
    '일정 숨김',
    () => mutate(useHideCalendarEvent, { source: 'GOOGLE', eventId: 'e1' }),
  ],
  [
    '일정 숨김 해제',
    () => mutate(useUnhideCalendarEvent, { source: 'GOOGLE', eventId: 'e1' }),
  ],
  [
    '커스텀 일정 생성',
    () => mutate(useCreateCustomCalendarEvent, CUSTOM_EVENT_INPUT),
  ],
  [
    '커스텀 일정 수정',
    () =>
      mutate(useUpdateCustomCalendarEvent, {
        eventId: 'e1',
        input: CUSTOM_EVENT_INPUT,
      }),
  ],
  [
    '커스텀 일정 삭제',
    () => mutate(useDeleteCustomCalendarEvent, { eventId: 'e1' }),
  ],
];

let current: ReturnType<typeof setup>;

/** 훅을 렌더해 mutateAsync를 한 번 실행한다. 입력 타입은 훅의 변수 타입에서 가져온다 */
const mutate = async <TVariables,>(
  useHook: () => {
    mutateAsync: (input: TVariables) => Promise<unknown>;
  },
  input: NoInfer<TVariables>,
) => {
  const { result } = renderHook(() => useHook(), {
    wrapper: current.wrapper,
  });
  await act(() => result.current.mutateAsync(input));
};

describe('관리자 캘린더 변경 후 공개 캘린더 무효화', () => {
  beforeEach(() => {
    current = setup();
  });

  it.each(MUTATIONS)(
    '%s 성공 시 이름·id 캘린더 키를 모두 무효화한다',
    async (_, run) => {
      await run();

      PUBLIC_CALENDAR_KEYS.forEach((key) =>
        expect(isInvalidated(current.queryClient, key)).toBe(true),
      );
    },
  );

  it.each(MUTATIONS)(
    '%s 성공 시 동아리 상세는 건드리지 않는다',
    async (_, run) => {
      await run();

      expect(
        isInvalidated(current.queryClient, queryKeys.club.detail('abc123')),
      ).toBe(false);
    },
  );
});
