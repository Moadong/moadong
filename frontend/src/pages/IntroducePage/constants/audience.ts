// 소개 페이지의 대상(학생/운영진) 구분과 대상별 문구를 정의한다
import { CLUB_FAQ, IntroduceFaqItem, STUDENT_FAQ } from './introduceFaq';

export type Audience = 'student' | 'club';

export const DEFAULT_AUDIENCE: Audience = 'student';

/** `?for=club`이면 운영진 소개를 연다. 학생은 쿼리 없이 기본값이다 */
export const AUDIENCE_QUERY_KEY = 'for';

export const AUDIENCE_TABS: {
  value: Audience;
  emoji: string;
  label: string;
  /** 좁은 화면용 짧은 이름 */
  shortLabel: string;
}[] = [
  {
    value: 'student',
    emoji: '🙋',
    label: '동아리 찾는 학생',
    shortLabel: '학생',
  },
  {
    value: 'club',
    emoji: '📣',
    label: '부원 찾는 운영진',
    shortLabel: '운영진',
  },
];

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  /** 내가 보낸 메시지(오른쪽 노란 말풍선) */
  mine?: boolean;
}

interface AudienceContent {
  hero: {
    /** 큰 제목. 줄바꿈은 \n으로 */
    title: string;
    subtitle: string;
  };
  problem: { title: string; roomName: string; messages: ChatMessage[] };
  faq: IntroduceFaqItem[];
  contact: { title: string };
}

export const AUDIENCE_CONTENT: Record<Audience, AudienceContent> = {
  student: {
    hero: {
      title: '부경대 동아리,\n여기 다 모여 있어요',
      subtitle: '찾고, 보고, 지원까지 모아동에서 한 번에',
    },
    problem: {
      title: '동아리 찾기 너무 불편하지 않으셨나요',
      roomName: '26학번 새내기방',
      messages: [
        {
          sender: '경영 새내기',
          text: '혹시 동아리 어디서 찾아요?? 에타 홍보게시판 아무리 내려도 끝이 없어요ㅠㅠ',
          time: '오후 9:41',
        },
        {
          sender: '컴공 새내기',
          text: '밴드 동아리 모집 언제 하는지 아시는 분…',
          time: '오후 9:42',
        },
        {
          sender: '디자인 새내기',
          text: '헐 그거 지난주에 끝났대요',
          time: '오후 9:42',
        },
        {
          sender: '컴공 새내기',
          text: '?? 공지 어디 있었는데요ㅠ',
          time: '오후 9:43',
        },
        {
          sender: '경영 새내기',
          text: '인스타 계정 하나하나 들어가서 보는 중인데 이게 맞나 싶음ㅋㅋㅋ',
          time: '오후 9:45',
        },
        {
          sender: '나',
          text: '동아리 하나 찾는 게 왜 이렇게 힘들어ㅠㅠ',
          time: '오후 9:46',
          mine: true,
        },
      ],
    },
    faq: STUDENT_FAQ,
    contact: {
      title: '나에게 맞는 동아리, 지금 찾아보세요',
    },
  },
  club: {
    hero: {
      title: '부원 모집,\n이제 모아동에서 끝내세요',
      subtitle: '홍보부터 지원서, 지원자 관리까지 한 곳에서',
    },
    problem: {
      title: '동아리 운영, 이런 게 번거롭지 않으셨나요',
      roomName: '동아리 운영진방',
      messages: [
        {
          sender: '회장',
          text: '이번 학기 지원서 폼 누가 만들어요?',
          time: '오후 11:02',
        },
        {
          sender: '총무',
          text: '작년 구글폼 복사해서 쓰면 되지 않나요',
          time: '오후 11:03',
        },
        {
          sender: '회장',
          text: '응답 시트 엑셀로 옮겨서 면접 일정 정리하는 거 또 해야 됨ㅠㅠ',
          time: '오후 11:03',
        },
        {
          sender: '부회장',
          text: '모집 끝나면 공연 홍보는 어디 올리지… 에타에 올려도 금방 묻혀요',
          time: '오후 11:05',
        },
        {
          sender: '총무',
          text: '동아리 소개글도 또 써야 돼요? 작년 거 어디 있지',
          time: '오후 11:06',
        },
        {
          sender: '나',
          text: '이걸 매 학기 반복하는 거 실화냐ㅠ',
          time: '오후 11:07',
          mine: true,
        },
      ],
    },
    faq: CLUB_FAQ,
    contact: {
      title: '우리 동아리도 모아동에서 시작해 보세요',
    },
  },
};
