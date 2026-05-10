import type { Performance } from './performances';

export interface FestivalDay {
  id: string;
  date: string; // 'YYYY-MM-DD'
  label: string; // 탭 레이블 e.g. '5/14'
  fullDateLabel: string; // 헤더 날짜 e.g. '2026.05.14 (목)'
  timeRange: string; // e.g. '12:30 - 18:00'
  location: string;
  performances: Performance[];
  mainStagePerformances?: Performance[];
}

export const BUSKING_DAYS: FestivalDay[] = [
  {
    id: 'day1',
    date: '2026-05-11',
    label: 'Day1',
    fullDateLabel: '2026.05.11 (월)',
    timeRange: '19:30 ~ 20:30',
    location: '잔디광장 무대',
    performances: [],
    mainStagePerformances: [
      {
        id: 101,
        name: 'YB',
        startTime: '',
        endTime: '',
        songs: [],
      },
    ],
  },
  {
    id: 'day2',
    date: '2026-05-12',
    label: 'Day2',
    fullDateLabel: '2026.05.12 (화)',
    timeRange: '14:30 - 19:30',
    location: '잔디광장 무대',
    performances: [
      {
        id: 1,
        name: '국제교류부 공연',
        startTime: '14:30',
        endTime: '16:00',
        songs: [],
      },
      {
        id: 2,
        name: '전통예술연구회 터',
        startTime: '16:00',
        endTime: '16:25',
        songs: ['청도 차산농악', '웃다리 사물놀이'],
      },
      {
        id: 3,
        name: '송웨이브',
        startTime: '16:25',
        endTime: '16:55',
        songs: [
          '대화가필요해',
          '오늘부터1일',
          '행복한 나를',
          '오늘도 빛나는 너에게',
          'Congratulations',
        ],
      },
      {
        id: 4,
        name: '테크니칼',
        startTime: '16:55',
        endTime: '17:20',
        songs: ['군청일화', '작은 사랑의 노래', 'Holiday', '비냄새'],
      },
      {
        id: 5,
        name: '씨사운드',
        startTime: '17:20',
        endTime: '17:50',
        songs: [
          '사랑이죄야?',
          'All For You',
          '밥만 잘 먹더라',
          "Don't Look Back In Anger",
          '예뻤어',
        ],
      },
      {
        id: 6,
        name: '백경이의 스케치북 with 한누리',
        startTime: '18:00',
        endTime: '19:30',
        songs: [
          '군 입대 앞에서 갈린 이별과 약속',
          '짝사랑, 실패와 현재의 두 감정',
        ],
      },
    ],
    mainStagePerformances: [
      {
        id: 101,
        name: '최예나',
        startTime: '19:40',
        endTime: '',
        songs: [],
      },
      {
        id: 102,
        name: '이창섭',
        startTime: '',
        endTime: '',
        songs: [],
      },
    ],
  },
  {
    id: 'day3',
    date: '2026-05-13',
    label: 'Day3',
    fullDateLabel: '2026.05.13 (수)',
    timeRange: '15:30 - 19:30',
    location: '잔디광장 무대',
    performances: [
      {
        id: 1,
        name: '올림',
        startTime: '15:30',
        endTime: '15:55',
        songs: ["Can't Stop", '해초', 'Loveholic', 'Love Song'],
      },
      {
        id: 2,
        name: 'PKNUO',
        startTime: '15:55',
        endTime: '16:25',
        songs: [
          'When you wish upon a star',
          '인생의 회전목마',
          '봄바람',
          '꿈빛 파티시엘',
          '5월의 마을',
          '붉은노을',
        ],
      },
      {
        id: 3,
        name: '한누리',
        startTime: '16:25',
        endTime: '16:55',
        songs: [
          '초록',
          '아직도 사랑하면 안 되는 건가요',
          'Stay with me',
          '우주의 여름',
          'Alive',
        ],
      },
      {
        id: 4,
        name: '모비딕스',
        startTime: '16:55',
        endTime: '17:20',
        songs: [
          '20s',
          'Stand Up!',
          'SEASON IN THE SUN',
          '군청일화',
          '게임 오버 ?',
          '보수공사',
        ],
      },
      {
        id: 5,
        name: 'UCDC',
        startTime: '17:30',
        endTime: '18:00',
        songs: [
          'Hip-Hop',
          'body',
          '다시만난오늘',
          'LIKE YOU BETTER',
          'Breaking',
          'Locking',
          '404',
          'Waacking',
          'I NEED YOU',
          'All Genre',
        ],
      },
      {
        id: 6,
        name: '부경가왕',
        startTime: '18:00',
        endTime: '19:30',
        songs: [
          '금곡동 황소개구리 "중독된 사랑" vs 내 꿈은 3대 500 "가수가 된 이유"',
          '고막청소기 "꿈에" vs 설계실 탈출 "Rolling in the deep"',
          '짱구는 5학년 "끝사랑" vs 트롯 가왕 "안동역에서"',
          '지금부터가 반전 "Beautiful things" vs 햇님이 "요즘 바쁜가봐"',
        ],
      },
    ],
    mainStagePerformances: [
      {
        id: 101,
        name: 'FIFTY FIFTY',
        startTime: '20:00',
        endTime: '',
        songs: [],
      },
      {
        id: 102,
        name: '비와이',
        startTime: '',
        endTime: '',
        songs: [],
      },
    ],
  },
  {
    id: 'day4',
    date: '2026-05-14',
    label: 'Day4',
    fullDateLabel: '2026.05.14 (목)',
    timeRange: '16:05 - 19:30',
    location: '잔디광장 무대',
    performances: [
      {
        id: 1,
        name: '매니아',
        startTime: '16:05',
        endTime: '16:30',
        songs: ['질주', '사포닌 같은 너', 'Time is Running Out', '멋진 헛간'],
      },
      {
        id: 2,
        name: '보블리스',
        startTime: '16:30',
        endTime: '16:50',
        songs: [
          'Another Day of Sun',
          '하늘을 달리다',
          '서울살이 몇핸가요',
          'Can’t help falling in love',
        ],
      },
      {
        id: 3,
        name: '쇳물결',
        startTime: '16:50',
        endTime: '17:20',
        songs: ['GET LUCKY!', '좋은날', '맨정신', '삐딱하게', 'What’s up'],
      },
      {
        id: 4,
        name: '네오쇼크',
        startTime: '17:20',
        endTime: '18:00',
        songs: [
          'drip',
          'play',
          '캐치캐치',
          'BLACKHOLE',
          'ETA',
          'TAP+ Smoothie',
          'GGUM',
          'Standing next to you',
          '소원을 말해봐',
          "that's a no no",
        ],
      },
      {
        id: 5,
        name: '부경듀엣',
        startTime: '18:00',
        endTime: '19:30',
        songs: [
          '장도연과 박나래 - 기다리다',
          '음주 - 술이문제야',
          '순자씨 - 날봐,귀순',
          '피어나 내 도도독 - 라라라',
          '홍루비비디바비디부 - Die With A Smile',
          '강태동그는감히전설이라고할수있다 - 집에가지마',
        ],
      },
    ],
    mainStagePerformances: [
      {
        id: 101,
        name: 'V.O.S',
        startTime: '19:40',
        endTime: '',
        songs: [],
      },
      {
        id: 102,
        name: '청하',
        startTime: '',
        endTime: '',
        songs: [],
      },
    ],
  },
];
