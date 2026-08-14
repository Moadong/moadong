import API_BASE_URL from '@/constants/api';
import type { HiddenCalendarEvent } from '@/types/club';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

const BASE_URL = `${API_BASE_URL}/api/integration/calendar-events/hidden`;

export const fetchHiddenCalendarEvents = async () => {
  const response = await secureFetch(BASE_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await handleResponse<HiddenCalendarEvent[]>(
    response,
    '숨긴 일정 조회에 실패했습니다.',
  );
  return data ?? [];
};

export const hideCalendarEvent = async (input: HiddenCalendarEvent) => {
  const response = await secureFetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  await handleResponse<string>(response, '일정 숨김에 실패했습니다.');
};

export const unhideCalendarEvent = async (input: HiddenCalendarEvent) => {
  const response = await secureFetch(BASE_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  await handleResponse<string>(response, '일정 표시에 실패했습니다.');
};
