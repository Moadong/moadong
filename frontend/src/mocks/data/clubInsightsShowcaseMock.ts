// 팀 공유용 시안: 분과별 2개 동아리의 구조화 정보 예시. 회비·모임·선발은 각 동아리 실제 소개·FAQ에서 옮겼고, 키워드 수·부원 한마디는 예시다
import { ClubInsights, ClubKeywordVote } from '@/types/clubInsights';

const kw = (
  id: string,
  emoji: string,
  label: string,
  count: number,
): ClubKeywordVote => ({ id, emoji, label, count });

export const SHOWCASE_CLUBS: {
  category: string;
  clubs: { id: string; name: string; summary: string }[];
}[] = [
  {
    category: '공연',
    clubs: [
      {
        id: '6873bd299033815c4391192e',
        name: 'UCDC',
        summary: '4개 대학 연합 스트릿 댄스',
      },
      {
        id: '67ebf9f75c8623081055881c',
        name: '송웨이브',
        summary: '통기타 어쿠스틱 밴드',
      },
    ],
  },
  {
    category: '운동',
    clubs: [
      { id: '6873c0609033815c43911958', name: '후라', summary: '야구 동아리' },
      {
        id: '67e54ae51cfd27718dd40be9',
        name: '부경다이버',
        summary: '스킨스쿠버 다이빙',
      },
    ],
  },
  {
    category: '학술',
    clubs: [
      {
        id: '67e54ae51cfd27718dd40be8',
        name: 'TIME',
        summary: '영어 기사 읽고 토론',
      },
      {
        id: '6873c76259cb4c2edff26465',
        name: 'O.S.T',
        summary: '공모전 기획',
      },
    ],
  },
  {
    category: '취미교양',
    clubs: [
      { id: '67e54ae51cfd27718dd40be6', name: '차사랑', summary: '다도' },
      { id: '67e54ae51cfd27718dd40be7', name: '입자', summary: '사진' },
    ],
  },
  {
    category: '봉사',
    clubs: [
      {
        id: '67e54ae51cfd27718dd40bdd',
        name: '미담장학회',
        summary: '교육 봉사·멘토링',
      },
      {
        id: '6873bfaf9033815c43911949',
        name: '절영회',
        summary: '벽화 봉사',
      },
    ],
  },
  {
    category: '종교',
    clubs: [
      { id: '67ee2ca3b35e3c267e3c248d', name: 'IVF', summary: '기독교 공동체' },
      { id: '6873c1349033815c4391196d', name: 'SFC', summary: '기독교 공동체' },
    ],
  },
];

export const showcaseInsights: Record<string, ClubInsights> = {
  // UCDC
  '6873bd299033815c4391192e': {
    facts: {
      meetingSchedule: '주 3회 · 월수금 저녁 6~8시',
      memberCount: 62,
      beginnerFriendly: true,
      selection: 'NONE',
      extraPerk: { emoji: '🎤', label: '4개 대학 연합 공연' },
    },
    keywords: {
      participantCount: 47,
      keywords: [
        kw('beginner', '🔰', '춤 처음이어도 괜찮아요', 39),
        kw('stage', '🎤', '무대에 설 기회가 많아요', 33),
        kw('friendly', '🤗', '선후배가 다 같이 친해요', 30),
        kw('genre', '🕺', '여러 장르를 체험해요', 24),
        kw('busy', '🔥', '연습이 꽤 빡세요', 18),
        kw('dinner', '🍗', '매주 회식이 있어요', 15),
      ],
    },
    fit: {
      goodFor: [
        '무대나 버스킹에 한 번쯤 서 보고 싶은 분',
        '춤은 처음이지만 제대로 배워 보고 싶은 분',
        '다른 학교 친구도 사귀고 싶은 분',
      ],
      thinkTwice: [
        '주 3회 저녁 연습이 부담스러운 분',
        '조용히 혼자 즐기는 취미를 찾는 분',
      ],
    },
    yearlyEvents: [
      { month: 3, emoji: '👋', title: '신입생 환영회' },
      { month: 4, emoji: '🕺', title: '장르 체험 기간' },
      { month: 5, emoji: '🎪', title: '대동제 공연' },
      { month: 7, emoji: '🤝', title: '4개 대학 합동 워크숍' },
      { month: 9, emoji: '🎤', title: '버스킹' },
      { month: 11, emoji: '🌟', title: '정기 발표회' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '장르 체험', date: '합류 후 여름방학 전까지' },
        { label: '첫 무대 준비', date: '장르를 정한 뒤' },
      ],
      notices: [
        '오디션 없이 네이버 폼이나 동방 방문으로 신청해요',
        '정규 연습은 월·수·금 오후 6~8시예요 (요일은 바뀔 수 있어요)',
      ],
    },
    memberVoices: [
      {
        quote:
          '아이솔레이션도 몰랐는데 1년 만에 축제 무대에 섰어요. 선배들이 진짜 하나하나 봐줘요.',
        author: '25학번 · 미디어커뮤니케이션학부',
        tenure: '1년째 활동 중',
      },
      {
        quote:
          '내성적이라 걱정했는데 매주 회식 덕분에 금방 친해졌어요. 연합이라 타대 친구도 생겨요.',
        author: '24학번 · 경영학부',
        tenure: '2년째 활동 중',
      },
    ],
  },

  // 송웨이브
  '67ebf9f75c8623081055881c': {
    facts: {
      meetingSchedule: '정기 연습 · 광안리 버스킹',
      fee: { amount: 35000, period: 'ONCE' },
      feeNote: '학기 말에 사용 내역 공개',
      beginnerFriendly: true,
      selection: 'AUDITION',
      extraPerk: { emoji: '🎸', label: '기타는 선배가 처음부터 알려줘요' },
    },
    keywords: {
      participantCount: 38,
      keywords: [
        kw('romance', '🌊', '캠퍼스 낭만이 있어요', 31),
        kw('guitar', '🎸', '기타를 처음 배워도 돼요', 27),
        kw('friendly', '🤗', '선배들이 친절해요', 25),
        kw('play', '🎳', '연습 말고도 놀 거리가 많아요', 20),
        kw('stage', '🎤', '무대 경험이 쌓여요', 17),
        kw('transparent', '🧾', '회비 관리가 투명해요', 9),
      ],
    },
    fit: {
      goodFor: [
        '광안리에서 버스킹 해 보고 싶은 분',
        '노래나 기타 중 하나라도 좋아하는 분',
        '보드게임·볼링처럼 같이 놀 친구가 필요한 분',
      ],
      thinkTwice: ['오디션이 많이 부담스러운 분 (기회는 세 번 있어요)'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🎙️', title: '오디션 · 신입 환영회' },
      { month: 4, emoji: '🎶', title: '신입생 소발표회' },
      { month: 5, emoji: '🌊', title: '광안리 버스킹' },
      { month: 7, emoji: '🏖️', title: '하계 MT' },
      { month: 10, emoji: '🎸', title: '기타 소발표회' },
      { month: 12, emoji: '🌟', title: '정기 발표회 · 동계 MT' },
    ],
    recruitmentGuide: {
      schedule: [
        {
          label: '1차 오디션',
          date: '3/5(목) 18:30',
          place: '나비센터(B12) 2층 소극장',
        },
        {
          label: '2차 오디션',
          date: '3/11(수) 18:30',
          place: '미래관(A21) 소민홀',
        },
        {
          label: '3차 오디션',
          date: '3/16(월) 18:30',
          place: '나비센터(B12) 2층 소극장',
        },
        { label: '결과 연락', date: '오디션 후 이틀 안에' },
      ],
      notices: [
        '떨어져도 다음 차수에 다시 지원할 수 있어요',
        '입회비는 3만 5천원이에요',
      ],
    },
    memberVoices: [
      {
        quote:
          '기타 코드 하나도 몰랐는데 한 학기 지나니까 버스킹 반주를 하고 있더라고요.',
        author: '25학번 · 국어국문학과',
        tenure: '1년째 활동 중',
      },
      {
        quote:
          '광안리 앞에서 노래하던 날은 대학 생활 통틀어 제일 기억에 남아요.',
        author: '24학번 · 해양수산경영경제학부',
        tenure: '2년째 활동 중',
      },
    ],
  },

  // 부경다이버
  '67e54ae51cfd27718dd40be9': {
    facts: {
      meetingSchedule: '평일 2회 · 주말 1회 (신청제)',
      fee: { amount: 40000, period: 'SEMESTER' },
      feeNote: '가입비 4만원 별도 · 자격증 50만원 분납 가능',
      beginnerFriendly: true,
      selection: 'INTERVIEW',
      extraPerk: { emoji: '🤿', label: '스쿠버 장비 전부 구비' },
    },
    keywords: {
      participantCount: 33,
      keywords: [
        kw('special', '🐠', '다른 데서 못 할 경험이에요', 30),
        kw('safe', '🦺', '안전하게 가르쳐줘요', 26),
        kw('trip', '✈️', '원정이 정말 재밌어요', 24),
        kw('swim', '🏊', '수영 못해도 괜찮아요', 19),
        kw('cost', '💸', '자격증 비용은 꽤 들어요', 14),
        kw('morning', '🌅', '훈련이 오전이에요', 10),
      ],
    },
    fit: {
      goodFor: [
        '바닷속을 직접 보고 싶은 분',
        '자격증까지 따서 제대로 해 보고 싶은 분',
        '여름 제주·겨울 해외 원정에 끌리는 분',
      ],
      thinkTwice: [
        '자격증 비용(약 50만원)이 부담되는 분',
        '오전 훈련 시간을 내기 어려운 분',
      ],
    },
    yearlyEvents: [
      { month: 3, emoji: '📝', title: '서류 · 면접' },
      { month: 4, emoji: '📘', title: 'PADI 이론 교육' },
      { month: 5, emoji: '🏊', title: '풀장 실기' },
      { month: 6, emoji: '🌊', title: '오픈워터 자격증' },
      { month: 8, emoji: '🏝️', title: '제주도 하계원정' },
      { month: 10, emoji: '🌙', title: '나이트 다이빙' },
      { month: 1, emoji: '✈️', title: '해외 원정' },
    ],
    recruitmentGuide: {
      schedule: [
        {
          label: '면접',
          date: '3/5 동아리 소개 행사 날',
          place: '안 되면 따로 일정 조율',
        },
        { label: '오픈워터 교육', date: '합격 후 4월부터' },
      ],
      notices: [
        '가입비 4만원, 학기 회비 4만원이에요',
        '자격증이 없으면 취득 비용 50만원이 따로 들어요 (2~3회 분납 가능)',
        '수영을 못해도, 시력이 나빠도 괜찮아요',
      ],
    },
    memberVoices: [
      {
        quote:
          '수영을 못해서 망설였는데 슈트 입으면 뜬다는 말이 진짜였어요. 제주 바다 속은 아직도 생생해요.',
        author: '24학번 · 해양생산시스템관리학부',
        tenure: '2년째 활동 중',
      },
      {
        quote:
          '42년 무사고라는 게 괜히 있는 말이 아니더라고요. 안전 교육이 철저해요.',
        author: '23학번 · 생태공학과',
        tenure: '3년째 활동 중',
      },
    ],
  },

  // TIME
  '67e54ae51cfd27718dd40be8': {
    facts: {
      meetingSchedule: '매주 목 저녁 6시 10분',
      fee: { amount: 20000, period: 'SEMESTER' },
      feeNote: '모임 통장으로 내역 공개',
      beginnerFriendly: true,
      selection: 'INTERVIEW',
      extraPerk: { emoji: '📚', label: '시험기간엔 쉬어요' },
    },
    keywords: {
      participantCount: 29,
      keywords: [
        kw('light', '🪶', '영어 부담이 생각보다 적어요', 24),
        kw('friends', '👯', '다른 과 친구를 사귀어요', 22),
        kw('steady', '📅', '매주 꾸준히 하게 돼요', 18),
        kw('info', '💡', '학교 정보를 많이 얻어요', 15),
        kw('mentoring', '🏫', '고교 멘토링을 해 봐요', 12),
        kw('play', '⚾', '야구장·볼링 번개가 있어요', 10),
      ],
    },
    fit: {
      goodFor: [
        '학기 중에 가볍게 영어를 놓지 않고 싶은 분',
        '다른 과 사람들과 이야기 나누고 싶은 분',
        '매주 한 번 꾸준히 나올 수 있는 분',
      ],
      thinkTwice: ['영어 회화 실력을 빠르게 올리는 게 목표인 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🍻', title: '개강총회' },
      { month: 5, emoji: '🏫', title: 'Go Together 고교 멘토링' },
      { month: 6, emoji: '🎉', title: '종강총회' },
      { month: 9, emoji: '🎂', title: '창립제' },
      { month: 11, emoji: '🏆', title: '시사 퀴즈 대회' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '면접 신청 마감', date: '8/26' },
        { label: '면접', date: '8월 말' },
        { label: '첫 정기 모임', date: '개강 후 매주 목 18:10' },
      ],
      notices: [
        '지원서를 낸 뒤 회장 번호로 카톡이나 문자를 꼭 보내 주세요',
        '1·2학년을 먼저 뽑지만 3·4학년도 지원할 수 있어요',
        '학기 회비는 2만원이에요',
      ],
    },
    memberVoices: [
      {
        quote:
          '토론은 한국어로 하고 마지막에 영어로 짧게 정리해서 부담이 없어요. 그래도 1년 하니 기사 읽는 속도가 늘었어요.',
        author: '24학번 · 영어영문학부',
        tenure: '2년째 활동 중',
      },
      {
        quote: '공대생인데 경영·인문 친구들이랑 이야기하는 게 제일 재밌어요.',
        author: '25학번 · 컴퓨터공학부',
        tenure: '1년째 활동 중',
      },
    ],
  },

  // O.S.T
  '6873c76259cb4c2edff26465': {
    facts: {
      meetingSchedule: '매주 목 저녁 6시 30분',
      fee: { amount: 15000, period: 'SEMESTER' },
      memberCount: 60,
      beginnerFriendly: true,
      extraPerk: { emoji: '🏆', label: '학기 말 발표회 시상' },
    },
    keywords: {
      participantCount: 44,
      keywords: [
        kw('portfolio', '📁', '결과물이 남아요', 37),
        kw('first', '🔰', '공모전 처음이어도 돼요', 34),
        kw('feedback', '🧭', '피드백을 꼼꼼히 받아요', 28),
        kw('people', '🧠', '배울 점 많은 사람이 많아요', 25),
        kw('game', '🎮', '전반부는 게임처럼 재밌어요', 21),
        kw('busy', '⏰', '후반부엔 꽤 바빠요', 16),
      ],
    },
    fit: {
      goodFor: [
        '공모전에 관심은 있는데 혼자 시작하기 막막한 분',
        '아이디어를 실제 결과물로 만들어 보고 싶은 분',
        '말주변보다 꾸준함에 자신 있는 분',
      ],
      thinkTwice: ['친목 위주로 가볍게만 즐기고 싶은 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🎮', title: '수상작 맞추기' },
      { month: 4, emoji: '🧪', title: '모의 공모전' },
      { month: 5, emoji: '🏝️', title: '모의 창업' },
      { month: 6, emoji: '🎯', title: '실전 공모전 도전' },
      { month: 9, emoji: '🎮', title: '2학기 시즌 시작' },
      { month: 12, emoji: '🏆', title: '최종 발표회 · 시상' },
    ],
    recruitmentGuide: {
      schedule: [{ label: '첫 정기 모임', date: '매주 목 18:30' }],
      notices: [
        '궁금한 점은 오픈채팅이나 인스타그램 DM으로 물어보세요',
        '학기 회비는 1만 5천원이에요',
      ],
    },
    memberVoices: [
      {
        quote:
          '혼자였으면 절대 못 냈을 공모전에 팀으로 나가서 장려상을 받았어요. 기획서 쓰는 법이 완전히 달라졌어요.',
        author: '24학번 · 시각디자인학과',
        tenure: '2년째 활동 중',
      },
      {
        quote: '스펙 쌓으러 왔다가 사람이 좋아서 계속 남았어요.',
        author: '23학번 · 경제학부',
        tenure: '3년째 활동 중',
      },
    ],
  },

  // 차사랑
  '67e54ae51cfd27718dd40be6': {
    facts: {
      meetingSchedule: '매주 목 정기모임 · 참여 자유',
      beginnerFriendly: true,
      selection: 'INTERVIEW',
      extraPerk: { emoji: '🍵', label: '면접은 얼굴 익히기용이에요' },
    },
    keywords: {
      participantCount: 36,
      keywords: [
        kw('friends', '👯', '친구 사귀기 정말 좋아요', 33),
        kw('light', '🪶', '부담이 하나도 없어요', 29),
        kw('alone', '🙋', '혼자 들어와도 금방 적응해요', 26),
        kw('calm', '🍵', '차 마시며 쉬어 가요', 20),
        kw('free', '🕊️', '참여가 자유로워요', 18),
        kw('age', '🎂', '나이 상관없이 어울려요', 11),
      ],
    },
    fit: {
      goodFor: [
        '학교 친구를 새로 만들고 싶은 분',
        '바쁜 학기 중에 쉬어 갈 모임이 필요한 분',
        '혼자 지원하는 게 걱정인 분',
      ],
      thinkTwice: ['전문적인 다도를 깊이 배우고 싶은 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🍻', title: '개강총회' },
      { month: 4, emoji: '🍵', title: '다도 체험 주회' },
      { month: 5, emoji: '📣', title: '응원전' },
      { month: 6, emoji: '🎲', title: '보드게임 데이' },
      { month: 10, emoji: '🏕️', title: 'MT' },
      { month: 12, emoji: '🎉', title: '종강총회' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '가벼운 면접', date: '지원 후 개별 연락' },
        { label: '첫 주회', date: '매주 목요일' },
      ],
      notices: [
        '면접이 있지만 합불보다 얼굴을 익히는 자리예요',
        '학번·나이·성별과 관계없이 재학생이면 지원할 수 있어요',
      ],
    },
    memberVoices: [
      {
        quote:
          '회장도 임원도 다 혼자 들어왔대요. 저도 혼자였는데 지금은 동방이 제일 편한 곳이에요.',
        author: '25학번 · 간호학과',
        tenure: '1년째 활동 중',
      },
      {
        quote: '시험기간에 동방에서 차 한 잔 마시면 그렇게 마음이 편해요.',
        author: '23학번 · 식품영양학과',
        tenure: '3년째 활동 중',
      },
    ],
  },

  // 입자
  '67e54ae51cfd27718dd40be7': {
    facts: {
      meetingSchedule: '분기별 정기 출사 · 포토클래스',
      fee: { amount: 25000, period: 'SEMESTER' },
      beginnerFriendly: true,
      selection: 'DOCUMENT',
      extraPerk: { emoji: '📷', label: '카메라 없어도 괜찮아요' },
    },
    keywords: {
      participantCount: 40,
      keywords: [
        kw('skill', '📈', '사진 실력이 확실히 늘어요', 34),
        kw('teach', '🧑‍🏫', '카메라 켜는 법부터 알려줘요', 30),
        kw('trip', '🚶', '출사 다니는 게 즐거워요', 27),
        kw('exhibit', '🖼️', '내 사진을 전시해 봐요', 22),
        kw('class', '📚', '포토클래스가 알차요', 17),
        kw('gift', '🎁', '포토 리뷰 상품이 있어요', 12),
      ],
    },
    fit: {
      goodFor: [
        '사진은 좋아하는데 카메라는 잘 모르는 분',
        '같이 출사 다닐 친구가 필요한 분',
        '내 사진을 전시회에 걸어 보고 싶은 분',
      ],
      thinkTwice: ['만 28세(98년생)를 넘긴 분 (가입 조건이에요)'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🍻', title: '개강총회' },
      { month: 4, emoji: '🌸', title: '봄 정기출사' },
      { month: 5, emoji: '🧑‍🏫', title: '포토클래스' },
      { month: 6, emoji: '🖼️', title: '정기 전시회' },
      { month: 10, emoji: '🍁', title: '가을 정기출사' },
      { month: 12, emoji: '🖼️', title: '정기 전시회 · 종강총회' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '합격 발표', date: '지원 마감 후 개별 연락' },
        { label: '회비 입금', date: '합격 발표 후' },
      ],
      notices: [
        '부경대 학부 재학생, 98년생 이하만 지원할 수 있어요',
        '학기 회비는 2만 5천원이에요',
        '카메라가 없어도 괜찮아요',
      ],
    },
    memberVoices: [
      {
        quote:
          '폰카만 쓰다가 들어왔는데 기술부원이 출사 때 옆에서 다 알려줘서 지금은 수동으로 찍어요.',
        author: '25학번 · 패션디자인학과',
        tenure: '1년째 활동 중',
      },
      {
        quote: '전시회에 제 사진이 걸린 날 부모님까지 오셨어요.',
        author: '24학번 · 건축학과',
        tenure: '2년째 활동 중',
      },
    ],
  },

  // 미담장학회
  '67e54ae51cfd27718dd40bdd': {
    facts: {
      meetingSchedule: '정기 멘토링 · 멘토 조모임',
      beginnerFriendly: true,
      selection: 'INTERVIEW',
      extraPerk: { emoji: '🌍', label: '전국 미담장학회 연합 활동' },
    },
    keywords: {
      participantCount: 52,
      keywords: [
        kw('meaning', '💝', '의미 있는 대학 생활이에요', 44),
        kw('kids', '🧒', '아이들과 정이 들어요', 38),
        kw('friends', '👯', '조모임으로 금방 친해져요', 30),
        kw('career', '🎤', '진로 강연을 해 봐요', 22),
        kw('network', '🤝', '타대 멘토들과 교류해요', 17),
        kw('flash', '⚡', '번개모임이 자주 있어요', 15),
      ],
    },
    fit: {
      goodFor: [
        '가르치는 일이나 교육 봉사에 관심 있는 분',
        '꾸준히 같은 아이들을 만나고 싶은 분',
        '봉사하면서 친구도 사귀고 싶은 분',
      ],
      thinkTwice: ['정해진 요일에 꾸준히 시간을 내기 어려운 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🍻', title: '개강총회' },
      { month: 4, emoji: '📚', title: '정기 멘토링 시작' },
      { month: 5, emoji: '🎤', title: '학과 설명회 · 진로 강연' },
      { month: 7, emoji: '🏕️', title: 'MT' },
      { month: 8, emoji: '📝', title: '2학기 신규 모집' },
      { month: 11, emoji: '🌍', title: '타대학 연합 활동' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '지원서 접수', date: '7/20(월) ~ 8/29(토)' },
        { label: '면접', date: '8/10부터 순차 연락' },
        { label: '합격 발표', date: '접수 마감 후 개별 공지' },
      ],
      notices: ['휴학생도 지원할 수 있어요', '이번에 70~80명을 추가로 뽑아요'],
    },
    memberVoices: [
      {
        quote:
          '한 학기 동안 만난 아이가 마지막 날 편지를 써 줬어요. 그 편지 아직 책상에 붙어 있어요.',
        author: '24학번 · 유아교육과',
        tenure: '2년째 활동 중',
      },
      {
        quote:
          '봉사만 하는 줄 알았는데 조모임이랑 번개가 많아서 친구가 확 늘었어요.',
        author: '25학번 · 행정학과',
        tenure: '1년째 활동 중',
      },
    ],
  },

  // 절영회
  '6873bfaf9033815c43911949': {
    facts: {
      meetingSchedule: '월 1~2회 주말 벽화 봉사',
      fee: { amount: 15000, period: 'SEMESTER' },
      feeNote: '신입 기준 · 기존 부원 1만원',
      beginnerFriendly: true,
      selection: 'DOCUMENT',
      extraPerk: { emoji: '🍱', label: '1회 봉사 8시간 · 점심 제공' },
    },
    keywords: {
      participantCount: 31,
      keywords: [
        kw('draw', '🎨', '그림 못 그려도 괜찮아요', 28),
        kw('hours', '⏱️', '봉사 시간이 넉넉해요', 25),
        kw('proud', '🖌️', '완성된 벽화가 뿌듯해요', 22),
        kw('play', '🎳', '볼링·영화 같은 친목이 많아요', 18),
        kw('lunch', '🍱', '점심이 나와요', 13),
        kw('weekend', '📅', '주말 하루를 써요', 9),
      ],
    },
    fit: {
      goodFor: [
        '봉사 시간을 의미 있게 채우고 싶은 분',
        '그림은 못 그려도 색칠은 즐거운 분',
        '주말에 함께 땀 흘릴 친구가 필요한 분',
      ],
      thinkTwice: ['주말 하루(약 8시간)를 비우기 어려운 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🍻', title: '개강총회' },
      { month: 4, emoji: '🎨', title: '영도구 벽화 봉사' },
      { month: 5, emoji: '🎨', title: '남구 벽화 봉사' },
      { month: 9, emoji: '🎳', title: '볼링 · 영화 번개' },
      { month: 11, emoji: '🏕️', title: 'MT' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '합격 연락', date: '지원 후 개별 연락' },
        { label: '첫 벽화 봉사', date: '매월 1~2회 주말' },
      ],
      notices: [
        '네이버 폼을 성실히 작성해 주세요',
        '신입 학기 회비는 1만 5천원이에요',
        '그림 실력은 전혀 상관없어요',
      ],
    },
    memberVoices: [
      {
        quote:
          '미술은 늘 자신 없었는데 도안대로 칠하기만 하면 돼서 마음 편해요. 다 칠하고 나면 동네가 달라 보여요.',
        author: '25학번 · 전자공학과',
        tenure: '1년째 활동 중',
      },
      {
        quote: '한 번 다녀오면 봉사 8시간이라 졸업 요건 채우기에도 좋아요.',
        author: '24학번 · 경영학부',
        tenure: '2년째 활동 중',
      },
    ],
  },

  // IVF
  '67ee2ca3b35e3c267e3c248d': {
    facts: {
      meetingSchedule: '큰모임 · 소그룹 매주',
      beginnerFriendly: true,
      selection: 'NONE',
      extraPerk: { emoji: '🛡️', label: '학교 공식 인증 중앙동아리' },
    },
    keywords: {
      participantCount: 24,
      keywords: [
        kw('warm', '🤍', '고민을 편하게 나눠요', 21),
        kw('community', '🫂', '든든한 공동체가 생겨요', 19),
        kw('study', '📖', '시험기간 스터디가 있어요', 14),
        kw('trip', '🧺', '나들이·MT가 즐거워요', 12),
        kw('newbie', '🌱', '신앙이 처음이어도 괜찮아요', 9),
      ],
    },
    fit: {
      goodFor: [
        '캠퍼스에서 신앙 공동체가 필요한 분',
        '일상의 고민을 편하게 나눌 사람이 필요한 분',
        '선교단체가 궁금한 분',
      ],
      thinkTwice: ['종교 활동 없이 친목만 원하는 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🌱', title: '새학기 큰모임' },
      { month: 4, emoji: '🧺', title: '나들이' },
      { month: 6, emoji: '📖', title: '시험기간 스터디' },
      { month: 7, emoji: '⛺', title: '여름 수련회' },
      { month: 10, emoji: '🏕️', title: 'MT' },
    ],
    recruitmentGuide: {
      schedule: [{ label: '큰모임', date: '매주 진행' }],
      notices: [
        '상시 모집이고 휴학생도 지원할 수 있어요',
        '지원서 작성이 어려우면 인스타그램 @kpt_ivf로 DM 주세요',
      ],
    },
    memberVoices: [
      {
        quote:
          '새내기 때 아무도 몰랐는데 소그룹에서 처음으로 속 이야기를 했어요. 지금은 가족 같아요.',
        author: '24학번 · 사회복지학과',
        tenure: '2년째 활동 중',
      },
    ],
  },

  // SFC
  '6873c1349033815c4391196d': {
    facts: {
      meetingSchedule: '화 소그룹 · 목 큰모임',
      beginnerFriendly: true,
      extraPerk: { emoji: '🔥', label: '매일 아침 모닥불 기도회' },
    },
    keywords: {
      participantCount: 21,
      keywords: [
        kw('routine', '🌅', '하루를 기도로 시작해요', 17),
        kw('small', '👥', '소그룹이 따뜻해요', 16),
        kw('community', '🫂', '든든한 공동체가 생겨요', 14),
        kw('friends', '👯', '선후배가 가까워요', 11),
      ],
    },
    fit: {
      goodFor: [
        '규칙적인 신앙생활을 하고 싶은 분',
        '작은 모임에서 깊이 교제하고 싶은 분',
      ],
      thinkTwice: ['매주 두 번 모임에 나오기 어려운 분'],
    },
    yearlyEvents: [
      { month: 3, emoji: '🌱', title: '새학기 큰모임' },
      { month: 7, emoji: '⛺', title: '여름 수련회' },
      { month: 9, emoji: '🔥', title: '2학기 모닥불 기도회' },
      { month: 12, emoji: '🎄', title: '성탄 모임' },
    ],
    recruitmentGuide: {
      schedule: [
        { label: '작은모임', date: '매주 화 18:00' },
        { label: '큰모임', date: '매주 목 18:30' },
      ],
      notices: [
        '지원서를 낸 뒤 인스타그램 @pknu_sfc로 DM을 꼭 보내 주세요 (지원 알림이 늦을 수 있어요)',
      ],
    },
    memberVoices: [
      {
        quote: '아침 기도회로 하루를 시작하니까 학교 생활 리듬이 잡혔어요.',
        author: '24학번 · 화학과',
        tenure: '2년째 활동 중',
      },
    ],
  },
};
