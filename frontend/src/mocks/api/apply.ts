import { http, HttpResponse } from 'msw';
import { mockData, mockOptions } from '../data/mockData';
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
        status: '200',
        message: 'OK',
        data: {
          clubId,
          title: mockData.title,
          description: mockData.description,
          questions: mockData.questions,
        },
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

  http.get(`${API_BASE}/:clubId/applications`, ({ params }) => {
    const clubId = String(params.clubId);
    if (!validateClubId(clubId)) {
      return HttpResponse.json(
        { message: ERROR_MESSAGE.INVALID_CLUB_ID },
        { status: 400 },
      );
    } 
    const list = mockOptions[clubId] ?? [];
    return HttpResponse.json({data: list}, {status: 200});
  }),
];
