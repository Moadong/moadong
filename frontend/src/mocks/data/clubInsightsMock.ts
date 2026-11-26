// 상세페이지 시안 확인용 구조화 정보 목 데이터. 후라는 실제 소개·FAQ에서 옮겼고, 나머지 분과별 예시는 showcase 파일에 있다
import { ClubInsights } from '@/types/clubInsights';
import { showcaseInsights } from './clubInsightsShowcaseMock';

const HURRAH_ID = '6873c0609033815c43911958';

export const clubInsightsMock: Record<string, ClubInsights> = {
  [HURRAH_ID]: {
    facts: {
      meetingSchedule: '주 1~2회 자율 훈련 · 토요일 시합',
      fee: { amount: 20000, period: 'SEMESTER' },
      feeNote: '신입 남 기준 · 여 1만원',
      memberCount: 48,
      beginnerFriendly: true,
      selection: 'NONE',
      extraPerk: { emoji: '🧤', label: '글러브·배트 무료 대여' },
    },
    keywords: {
      participantCount: 41,
      keywords: [
        { id: 'friendly', emoji: '🤗', label: '선배들이 친절해요', count: 36 },
        {
          id: 'beginner',
          emoji: '🔰',
          label: '초보도 금방 적응해요',
          count: 31,
        },
        {
          id: 'friends',
          emoji: '👯',
          label: '다른 과 친구를 사귀어요',
          count: 27,
        },
        { id: 'free', emoji: '🕊️', label: '참여가 자유로워요', count: 22 },
        { id: 'skill', emoji: '📈', label: '실력이 늘어요', count: 18 },
        { id: 'event', emoji: '🎉', label: '행사가 다양해요', count: 15 },
        { id: 'fee', emoji: '💸', label: '회비가 부담 없어요', count: 11 },
        { id: 'drink', emoji: '🙅', label: '술 강요가 없어요', count: 9 },
      ],
    },
    fit: {
      goodFor: [
        '야구는 좋아하는데 해본 적은 없는 분',
        '사직 직관 같이 갈 친구가 필요한 분',
        '학과 밖에서 친구를 만들고 싶은 분',
      ],
      thinkTwice: [
        '선수급 실력으로 우승만 노리는 분',
        '주말 오전 시합이 부담스러운 분',
      ],
    },
    yearlyEvents: [
      { month: 3, emoji: '📣', title: '신입 모집 · OT' },
      { month: 4, emoji: '⚾', title: '재부리그 개막' },
      { month: 5, emoji: '🏆', title: '총장기 대회' },
      { month: 6, emoji: '🏕️', title: '여름 MT' },
      { month: 7, emoji: '🏟️', title: '단체 직관' },
      { month: 9, emoji: '🔥', title: 'KUSF 클럽챔피언십' },
      { month: 10, emoji: '🤝', title: '타대 교류전' },
      { month: 12, emoji: '🎄', title: '종강 총회 · 시상' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '첫 훈련', date: '매주', place: '용당캠퍼스 대운동장' },
        { label: '신입 환영회', date: '합류 후 첫 달' },
      ],
      notices: [
        '지원서에 적은 전화번호로 회비 안내 문자가 가요',
        '회비는 신입 남 2만원 · 여 1만원이에요',
        '장비가 없어도 공용 장비로 바로 참여할 수 있어요',
      ],
    },
    memberVoices: [
      {
        quote:
          '공 한 번 안 던져본 상태로 들어왔는데, 선배들이 캐치볼부터 같이 해줘서 한 학기 만에 시합에 나갔어요.',
        author: '24학번 · 경영학부',
        tenure: '1년째 활동 중',
      },
      {
        quote:
          '시합 끝나고 다 같이 밥 먹는 게 제일 좋아요. 과 친구보다 후라 친구가 더 많아졌어요.',
        author: '23학번 · 기계공학과',
        tenure: '2년째 활동 중',
      },
      {
        quote:
          '참여를 강요하지 않아서 시험기간에 빠져도 눈치 안 보여요. 그래서 오래 하게 돼요.',
        author: '22학번 · 간호학과',
        tenure: '3년째 활동 중',
      },
    ],
  },
  ...showcaseInsights,
};
