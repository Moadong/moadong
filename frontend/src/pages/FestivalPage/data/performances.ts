export interface Performance {
  id: number;
  clubName: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  songs: string[];
}

export const performances: Performance[] = [
  {
    id: 1,
    clubName: '터',
    startTime: '12:30',
    endTime: '13:00',
    songs: ['차선농악 - 9명'],
  },
  {
    id: 2,
    clubName: '매니아',
    startTime: '13:00',
    endTime: '13:30',
    songs: [
      'Blur - Song 2',
      'OASIS - Supersonic',
      'Green Day - Dillema',
      'Radiohead - My Iron Lung',
    ],
  },
  {
    id: 3,
    clubName: '씨사운드',
    startTime: '13:30',
    endTime: '14:00',
    songs: [
      'Best part (feat. H.E.R) - Daniel Caesar, H.E.R.',
      '좋은 밤 좋은 꿈 - 너드커넥션',
      'Good bye bye - 토미오카 아이',
      '사랑하게 될거야 - 한로로',
    ],
  },
  {
    id: 4,
    clubName: '송웨이브',
    startTime: '14:00',
    endTime: '14:30',
    songs: [
      'Like my father - Jax',
      '오르트구름 - 윤하',
      '비행운 - 문문',
      'Latata - 아이들',
    ],
  },
  {
    id: 5,
    clubName: '쇳물결',
    startTime: '14:30',
    endTime: '15:00',
    songs: [
      "isn't she lovely",
      '사랑비 (어쿠)',
      'pretender - 히게단',
      'drive - 미연 (밴드)',
      '힙부 자작곡 (힙합)',
    ],
  },
  {
    id: 6,
    clubName: '테크니칼',
    startTime: '15:00',
    endTime: '15:30',
    songs: [
      '나는 나비 - yb',
      'Material Girl - the volunteers',
      '제제로감 - 10feet',
      '비냄새 - 극동아시아타이거즈',
    ],
  },
  {
    id: 7,
    clubName: '모비딕스',
    startTime: '15:30',
    endTime: '16:00',
    songs: [
      '공중정원 - 보아',
      '러브홀릭 - 러브홀릭',
      '레터 - 유다빈밴드',
      '좋지아니한가 - 유다빈밴드',
    ],
  },
  {
    id: 8,
    clubName: '한누리',
    startTime: '16:00',
    endTime: '16:30',
    songs: [
      '청춘 - Tokai',
      'Rules - 더 발룬티어스',
      'Not Out - 드래곤포니',
      '0+0 - 한로로',
    ],
  },
  {
    id: 9,
    clubName: '네오쇼크',
    startTime: '16:30',
    endTime: '17:00',
    songs: [
      '샤랄라 / 세이마이네임 - 7명',
      '404 (New Era) / 키키 - 5명',
      'fashion / 코르티스 - 5명',
      'Burning up / meovv - 5명',
      'Blue valentine / 엔믹스 - 6명',
      '하얀그리움 / Fromis9 - 5명',
      'I Do Me / 키키 - 5명',
      'Good Stuff / 카리나 - 7명',
      'Dirty work / aespa - 7명',
    ],
  },
  {
    id: 10,
    clubName: 'UCDC',
    startTime: '17:00',
    endTime: '17:30',
    songs: [
      'Locking (6명)',
      '르세라핌 - SPAGHETTI (5명)',
      '엔하이픈 - No Doubt (9명)',
      '투어스 - OVERDRIVE (6명)',
      'B-boy (11명)',
      'Waacking (5명)',
      'HipHop (7명)',
      '더보이즈 - ROAR (11명)',
      'BOYNEXTDOOR - Count To Love (6명)',
      'XXL - 영파씨 (BEBE choreo) (5명)',
      '세븐틴 - THUNDER (20명)',
      'All genre - JABBERLOOP (9명)',
    ],
  },
  {
    id: 11,
    clubName: '보블리스',
    startTime: '17:30',
    endTime: '18:00',
    songs: [
      '우리는 로렐라이 언덕의 여인들 - 4명',
      'Seasons of love - 10명',
      "You'll be found - 10명",
      '바람의 노래 - 4명',
    ],
  },
];
