import { EventSource } from 'eventsource';
import API_BASE_URL from '@/constants/api';
import {
  ApplicantSSECallbacks,
  ApplicantStatusEvent,
} from '@/types/applicants';

export const createApplicantSSE = (
  applicationFormId: string,
  eventHandlers: ApplicantSSECallbacks,
): EventSource | null => {
  let eventSource: EventSource | null = null;

  const connect = (): EventSource | null => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;

    const source = new EventSource(
      `${API_BASE_URL}/api/club/applicant/${applicationFormId}/sse`,
      {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
          }),
      },
    );

    source.addEventListener('applicant-status-changed', (e) => {
      try {
        const eventData: ApplicantStatusEvent = JSON.parse(e.data);
        eventHandlers.onStatusChange(eventData);
      } catch (parseError) {
        console.error('SSE PARSING ERROR:', parseError);
      }
    });

    source.onerror = (error) => {
      source.close();
      eventHandlers.onError(
        new Error(error?.message || 'SSE connection error'),
      );
    };

    return source;
  };

  eventSource = connect();
  return eventSource;
};
