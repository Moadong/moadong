import API_BASE_URL from '@/constants/api';
import type { ClubCalendarEvent, CustomCalendarEventInput } from '@/types/club';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

const BASE_URL = `${API_BASE_URL}/api/integration/custom-events`;

export const fetchCustomCalendarEvents = async () => {
  const response = await secureFetch(BASE_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await handleResponse<ClubCalendarEvent[]>(
    response,
    '직접 입력 일정 조회에 실패했습니다.',
  );
  return data ?? [];
};

export const createCustomCalendarEvent = async (
  input: CustomCalendarEventInput,
) => {
  const response = await secureFetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await handleResponse<ClubCalendarEvent>(
    response,
    '직접 입력 일정 생성에 실패했습니다.',
  );
  return data;
};

export const updateCustomCalendarEvent = async (
  eventId: string,
  input: CustomCalendarEventInput,
) => {
  const response = await secureFetch(`${BASE_URL}/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await handleResponse<ClubCalendarEvent>(
    response,
    '직접 입력 일정 수정에 실패했습니다.',
  );
  return data;
};

export const deleteCustomCalendarEvent = async (eventId: string) => {
  const response = await secureFetch(`${BASE_URL}/${eventId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  await handleResponse<string>(response, '직접 입력 일정 삭제에 실패했습니다.');
};
