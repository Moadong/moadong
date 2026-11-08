// 업데이트 기록 페이지에 보여 줄 학생·운영진 체감 변경 목록 (최신순)
import introduce_main_screen from '@/assets/images/introduce/introduce_main_screen.webp';

export interface UpdateEntry {
  /** YYYY-MM-DD. develop 머지일 기준 초안이라 실제 배포일과 다르면 고친다 */
  date: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
}

export const UPDATE_ENTRIES: readonly UpdateEntry[] = [
  {
    date: '2026-10-27',
    title: '홍보 탭에 새 글 수가 보여요',
    description:
      '아래 메뉴의 홍보 탭에 아직 안 본 새 글이 몇 개인지 숫자로 알려 드려요. 공연과 행사 소식을 놓치지 마세요.',
  },
  {
    date: '2026-10-14',
    title: '지원서 질문 순서를 손쉽게 바꿔요',
    description:
      '운영진은 지원서 질문을 길게 눌러 원하는 자리로 옮길 수 있어요. 이름 질문도 다른 질문처럼 순서를 바꿀 수 있어요.',
  },
  {
    date: '2026-09-27',
    title: '모집 기간을 동아리 페이지에서 바로 고쳐요',
    description:
      '관리자 페이지를 따로 열지 않아도, 동아리 페이지에서 버튼 한 번으로 지원서 모집 기간을 수정할 수 있어요.',
  },
  {
    date: '2026-09-18',
    title: '행사 장소를 지도에서 직접 찍어요',
    description:
      '홍보 글을 쓸 때 행사 위치를 지도에서 바로 골라요. 학생들은 어디로 가면 되는지 한눈에 알 수 있어요.',
  },
  {
    date: '2026-09-05',
    title: '운영진도 홍보 글을 올릴 수 있어요',
    description:
      '동아리 공연, 전시, 행사 소식을 운영진이 직접 올리고 관리해요. 올린 글은 모아동 홍보 탭에 바로 보여요.',
  },
  {
    date: '2026-09-03',
    title: '모아동 앱 홈이 새로워졌어요',
    description:
      '분과 아이콘과 배너를 홈 위쪽으로 올려, 앱을 열자마자 관심 있는 동아리를 더 빨리 찾을 수 있어요.',
    image: { src: introduce_main_screen, alt: '새로워진 모아동 앱 홈 화면' },
  },
  {
    date: '2026-08-27',
    title: '휴대폰으로도 지원자를 관리해요',
    description:
      '지원자 목록과 지원서 상세를 휴대폰 화면에 맞게 새로 만들었어요. 이동 중에도 서류를 보고 결과를 바꿀 수 있어요.',
  },
  {
    date: '2026-08-15',
    title: '모아동 우체통이 열렸어요',
    description:
      '바라는 점, 불편한 점, 응원 한마디를 모아동 팀에게 편지로 보내 주세요. 보낸 편지에 답장도 받아 볼 수 있어요.',
  },
  {
    date: '2026-08-14',
    title: '동아리 일정을 캘린더로 보여 줘요',
    description:
      '운영진이 Google·Notion 캘린더를 연결하면 동아리 페이지에 일정이 달력으로 보여요. 학생은 모임 날짜를 미리 확인해요.',
  },
  {
    date: '2026-07-27',
    title: '우리 동아리 통계를 확인해요',
    description:
      '동아리 페이지 조회수와 지원자 수를 기간별로 볼 수 있어요. 홍보가 얼마나 닿았는지 숫자로 확인하세요.',
  },
  {
    date: '2026-07-23',
    title: 'AI가 지원서 초안을 만들어 줘요',
    description:
      '버튼 한 번이면 우리 동아리 정보를 읽고 바로 쓸 수 있는 지원서 질문을 만들어 줘요. 다듬어서 그대로 쓰면 돼요.',
  },
];
