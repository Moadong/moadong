import API_BASE_URL from '@/constants/api';
import type { DatabaseId } from '@/types/branded';
import type {
  GoogleCalendarEvent,
  GoogleCalendarItem,
  GoogleCalendarListResponse,
  GoogleEventItem,
} from '@/types/google';
import type {
  NotionDatabaseOption,
  NotionPagesResponse,
  NotionSearchItem,
} from '@/types/notion';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

export type { GoogleCalendarItem, GoogleEventItem, GoogleCalendarEvent };
export type { NotionSearchItem, NotionDatabaseOption, NotionPagesResponse };

interface GoogleAuthorizeResponse {
  authorizeUrl: string;
}

interface GoogleTokenResponse {
  email: string;
}

export const fetchGoogleCalendarList = async (accessToken: string) => {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Google 캘린더 목록 조회에 실패했습니다.');
  }

  const data = await response.json();
  return (data.items ?? []) as GoogleCalendarItem[];
};

export const fetchGooglePrimaryEvents = async (accessToken: string) => {
  const query = new URLSearchParams({
    maxResults: '10',
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin: new Date().toISOString(),
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Google 캘린더 이벤트 조회에 실패했습니다.');
  }

  const data = await response.json();
  return (data.items ?? []) as GoogleEventItem[];
};

interface NotionTokenRequest {
  code: string;
}

interface NotionTokenResponse {
  accessToken?: string;
  workspaceName?: string;
  workspaceId?: string;
}

interface NotionAuthorizeResponse {
  authorizeUrl: string;
}

interface NotionPagesPayload {
  items?: NotionSearchItem[];
  results?: NotionSearchItem[];
  total_results?: number;
  totalResults?: number;
  database_id?: string;
  databaseId?: string;
}

interface NotionDatabasePayload {
  id: string;
  object?: string;
  title?: Array<{ plain_text?: string }>;
}

export const fetchNotionAuthorizeUrl = async (state?: string) => {
  const params = new URLSearchParams();
  if (state) {
    params.set('state', state);
  }

  const url = `${API_BASE_URL}/api/integration/notion/oauth/authorize${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await secureFetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await handleResponse<NotionAuthorizeResponse>(
    response,
    'Notion 인가 URL 생성에 실패했습니다.',
  );

  if (!data?.authorizeUrl) {
    throw new Error('Notion 인가 URL이 비어있습니다.');
  }
  return data.authorizeUrl;
};

export const exchangeNotionCode = async ({ code }: NotionTokenRequest) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/notion/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
      }),
    },
  );

  const data = await handleResponse<NotionTokenResponse>(
    response,
    'Notion 토큰 교환에 실패했습니다.',
  );
  return data;
};

export const fetchNotionPages = async () => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/notion/pages`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const data = await handleResponse<NotionPagesPayload | NotionSearchItem[]>(
    response,
    'Notion 데이터 조회에 실패했습니다.',
  );
  if (Array.isArray(data)) {
    return {
      items: data,
      totalResults: data.length,
    } satisfies NotionPagesResponse;
  }

  const items = (data?.items ?? data?.results ?? []) as NotionSearchItem[];
  const totalResults =
    data?.total_results ?? data?.totalResults ?? items.length;
  const databaseId = (data?.database_id ?? data?.databaseId) as
    | DatabaseId
    | undefined;
  return {
    items,
    totalResults,
    databaseId,
  } satisfies NotionPagesResponse;
};

export const fetchNotionDatabasePages = async ({
  databaseId,
  dateProperty,
}: {
  databaseId: string;
  dateProperty?: string;
}) => {
  const params = new URLSearchParams();
  if (dateProperty) {
    params.set('dateProperty', dateProperty);
  }

  const query = params.toString();
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/notion/databases/${databaseId}/pages${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const data = await handleResponse<NotionPagesPayload | NotionSearchItem[]>(
    response,
    'Notion 데이터베이스 페이지 조회에 실패했습니다.',
  );

  if (Array.isArray(data)) {
    return {
      items: data,
      totalResults: data.length,
      databaseId: databaseId as DatabaseId,
    } satisfies NotionPagesResponse;
  }

  const items = (data?.items ?? data?.results ?? []) as NotionSearchItem[];
  const totalResults =
    data?.total_results ?? data?.totalResults ?? items.length;
  const resolvedDatabaseId =
    data?.database_id ?? data?.databaseId ?? databaseId;
  return {
    items,
    totalResults,
    databaseId: resolvedDatabaseId as DatabaseId,
  } satisfies NotionPagesResponse;
};

export const fetchNotionDatabases = async () => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/notion/databases`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const data = await handleResponse<
    { results?: NotionDatabasePayload[] } | NotionDatabasePayload[]
  >(response, 'Notion 데이터베이스 목록 조회에 실패했습니다.');

  const databases = Array.isArray(data) ? data : (data?.results ?? []);
  return databases.map((database) => ({
    id: database.id,
    title:
      database.title
        ?.map((segment) => segment.plain_text ?? '')
        .join('')
        .trim() || '(이름 없는 데이터베이스)',
  })) as NotionDatabaseOption[];
};

export const fetchGoogleAuthorizeUrl = async (state?: string) => {
  const params = new URLSearchParams();
  if (state) {
    params.set('state', state);
  }

  const url = `${API_BASE_URL}/api/integration/google/oauth/authorize${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await secureFetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await handleResponse<GoogleAuthorizeResponse>(
    response,
    'Google 인가 URL 생성에 실패했습니다.',
  );

  if (!data?.authorizeUrl) {
    throw new Error('Google 인가 URL이 비어있습니다.');
  }
  return data.authorizeUrl;
};

export const exchangeGoogleCode = async (code: string) => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/google/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    },
  );

  const data = await handleResponse<GoogleTokenResponse>(
    response,
    'Google 토큰 교환에 실패했습니다.',
  );
  return data;
};

export const fetchGoogleCalendars = async () => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/google/calendars`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const data = await handleResponse<GoogleCalendarListResponse>(
    response,
    'Google 캘린더 목록 조회에 실패했습니다.',
  );
  return {
    items: data?.items ?? [],
    selectedCalendarId: data?.selectedCalendarId,
    selectedCalendarName: data?.selectedCalendarName,
  };
};

export const selectGoogleCalendar = async (
  calendarId: string,
  calendarName: string,
) => {
  const encodedId = encodeURIComponent(calendarId);
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/google/calendars/${encodedId}/select`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ calendarId, calendarName }),
    },
  );

  await handleResponse<string>(response, 'Google 캘린더 선택에 실패했습니다.');
};

export const disconnectGoogleCalendar = async () => {
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/google/connection`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  await handleResponse<string>(
    response,
    'Google Calendar 연결 해제에 실패했습니다.',
  );
};

export const fetchGoogleCalendarEvents = async (
  calendarId: string,
  timeMin?: string,
  timeMax?: string,
) => {
  const params = new URLSearchParams();
  if (timeMin) {
    params.set('timeMin', timeMin);
  }
  if (timeMax) {
    params.set('timeMax', timeMax);
  }

  const encodedId = encodeURIComponent(calendarId);
  const query = params.toString();
  const response = await secureFetch(
    `${API_BASE_URL}/api/integration/google/calendars/${encodedId}/events${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const data = await handleResponse<GoogleCalendarEvent[]>(
    response,
    'Google 캘린더 이벤트 조회에 실패했습니다.',
  );
  return data ?? [];
};
