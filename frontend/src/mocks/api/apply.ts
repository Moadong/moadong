import { http, HttpResponse } from 'msw';
import { mockData } from '../data/mockData';
import { API_BASE } from '../constants/clubApi';
import { validateClubId } from '../utils/validateClubId';

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
        clubId,
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
        clubId,
        message: '지원서가 성공적으로 제출되었습니다.',
      },
      { status: 200 },
    );
  }),
];
