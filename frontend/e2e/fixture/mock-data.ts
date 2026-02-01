export const MOCK_CLUB_ID = 'test-club-001';
export const MOCK_FORM_ID = 'test-form-001';

const MOCK_CLUB_NAME = '테스트 동아리';

/**
 * GET /api/club/search/* 응답
 * handleResponse가 { data: {...} } 를 자동 언래핑하므로 data로 감싼다.
 */
export const mockClubSearchResponse = {
  data: {
    clubs: [
      {
        id: MOCK_CLUB_ID,
        name: MOCK_CLUB_NAME,
        logo: '',
        cover: '',
        tags: ['테스트'],
        recruitmentStatus: 'OPEN',
        division: '중앙동아리',
        category: '학술',
        introduction: '테스트용 동아리입니다.',
      },
    ],
    totalCount: 1,
  },
};

/**
 * GET /api/club/{clubId} 응답
 */
export const mockClubDetailResponse = {
  data: {
    club: {
      id: MOCK_CLUB_ID,
      name: MOCK_CLUB_NAME,
      logo: '',
      cover: '',
      tags: ['테스트'],
      recruitmentStatus: 'OPEN',
      division: '중앙동아리',
      category: '학술',
      introduction: '테스트용 동아리입니다.',
      description: {
        introDescription: '동아리 소개 텍스트',
        activityDescription: '활동 설명',
        awards: [],
        idealCandidate: { tags: [], content: '' },
        benefits: '',
        faqs: [],
      },
      state: 'ACTIVE',
      feeds: [],
      presidentName: '테스트',
      presidentPhoneNumber: '010-0000-0000',
      recruitmentForm: '',
      recruitmentStart: '2026.01.01 00:00',
      recruitmentEnd: '2026.12.31 23:59',
      recruitmentTarget: '전체',
      socialLinks: {
        instagram: '',
        youtube: '',
        x: '',
      },
    },
  },
};

/**
 * GET /api/club/{clubId}/apply 응답 (지원서 옵션 목록)
 * 폼이 1개이면 ClubApplyButton이 바로 navigateToApplicationForm을 호출한다.
 */
export const mockApplicationOptionsResponse = {
  data: {
    forms: [
      {
        id: MOCK_FORM_ID,
        title: '2026년 1학기 신입부원 모집',
      },
    ],
  },
};

/**
 * GET /api/club/{clubId}/apply/{formId} 응답 (지원서 폼 데이터)
 * ClubApplyButton에서 formMode를 확인할 때와 ApplicationFormPage에서 폼을 렌더링할 때 둘 다 사용된다.
 */
export const mockApplicationFormResponse = {
  data: {
    title: '2026년 1학기 신입부원 모집',
    description: '테스트 동아리 지원서입니다.',
    semesterYear: 2026,
    semesterTerm: 'FIRST',
    formMode: 'INTERNAL',
    active: 'active',
    questions: [
      {
        id: 1,
        title: '이름',
        description: '지원자 이름을 입력해주세요.',
        type: 'NAME',
        options: { required: true },
        items: [],
      },
      {
        id: 2,
        title: '지원 동기',
        description: '동아리에 지원하게 된 동기를 적어주세요.',
        type: 'SHORT_TEXT',
        options: { required: true },
        items: [],
      },
      {
        id: 3,
        title: '관심 분야',
        description: '관심 있는 분야를 선택해주세요.',
        type: 'CHOICE',
        options: { required: true },
        items: [
          { value: '프로그래밍' },
          { value: '디자인' },
          { value: '기획' },
        ],
      },
    ],
  },
};
