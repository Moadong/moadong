import { http, HttpResponse } from 'msw';
import { mockData } from '../data/mockData';
import { API_BASE } from '../constants/clubApi';
import { validateClubId } from '../utils/validateClubId';
import { ERROR_MESSAGE } from '../constants/error';

export const applyHandlers = [
  http.get(`${API_BASE}/apply`, () => {
    return HttpResponse.json(
      { message: ERROR_MESSAGE.INVALID_CLUB_ID },
      { status: 400 },
    );
  }),

  http.get(`${API_BASE}/:clubId/apply`, ({ params }) => {
    const clubId = String(params.clubId);

    if (!validateClubId(clubId)) {
      return HttpResponse.json(
        { message: ERROR_MESSAGE.INVALID_CLUB_ID },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        clubId,
        form_title: mockData.title,
        questions: mockData.questions,
      },
      { status: 200 },
    );
  }),

  http.post(`${API_BASE}/:clubId/apply`, ({ params }) => {
    const clubId = String(params.clubId);

    if (!validateClubId(clubId)) {
      return HttpResponse.json(
        { message: ERROR_MESSAGE.INVALID_CLUB_ID },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        clubId,
        message: ERROR_MESSAGE.POST_APPLICATION_SUCCESS,
      },
      { status: 200 },
    );
  }),

  http.put(`${API_BASE}/:clubId/apply`, async ({ params }) => {
    const clubId = String(params.clubId);

    if (!validateClubId(clubId)) {
      return HttpResponse.json(
        { message: ERROR_MESSAGE.INVALID_CLUB_ID },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        clubId,
        message: ERROR_MESSAGE.PUT_APPLICATION_SUCCESS,
      },
      { status: 200 },
    );
  }),
];
