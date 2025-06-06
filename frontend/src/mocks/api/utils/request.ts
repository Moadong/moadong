import { createApiUrl } from '@/mocks/utils/createApiUrl';

export const sendApiRequest = async (
  clubId: string,
  answers: Record<number | string, string[]>,
  method: 'POST' | 'PUT',
) => {
  const response = await fetch(createApiUrl(clubId), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answers),
  });
  return response;
};

export const submitApplication = (
  clubId: string,
  answers: Record<number | string, string[]>,
) => sendApiRequest(clubId, answers, 'POST');

export const updateApplication = (
  clubId: string,
  answers: Record<number | string, string[]>,
) => sendApiRequest(clubId, answers, 'PUT');
