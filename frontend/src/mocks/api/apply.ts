import { http, HttpResponse } from 'msw';
import { mockData } from '../data/mockData';
import { API_BASE } from '../constants/api';

const validateClubId = (clubId: string | undefined) => {
  if (!clubId) return false;
  const numericClubId = parseInt(clubId, 10);
  return !isNaN(numericClubId) && numericClubId > 0;
};

export const clubHandlers = [
  http.get(`${API_BASE}/apply`, () => {
    return HttpResponse.json(
      { message: '유효하지 않은 클럽 ID입니다.' },
      { status: 400 },
    );
  }),

  http.get(`${API_BASE}/:clubId/apply`, ({ params }) => {
    const clubId = String(params.clubId);

    if (!validateClubId(clubId)) {
      return HttpResponse.json(
        { message: '유효하지 않은 클럽 ID입니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        clubId: parseInt(clubId, 10),
        form_title: mockData.form_title,
        questions: mockData.questions,
      },
      { status: 200 },
    );
  }),

  http.post(`${API_BASE}/:clubId/apply`, async ({ params, request }) => {
    const clubId = String(params.clubId);

    if (!validateClubId(clubId)) {
      return HttpResponse.json(
        { message: '유효하지 않은 클럽 ID입니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        clubId: parseInt(clubId, 10),
        message: '지원서가 성공적으로 제출되었습니다.',
        submittedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),
];
