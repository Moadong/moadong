// 업데이트 기록 페이지에 보여 줄 학생·운영진 체감 변경 목록 (최신순, 배포 이력 기준)
import introduce_main_screen from '@/assets/images/introduce/introduce_main_screen.webp';
import update_admin_ai from '@/assets/images/introduce/updates/update_admin_ai.webp';
import update_admin_applicants from '@/assets/images/introduce/updates/update_admin_applicants.webp';
import update_admin_edit from '@/assets/images/introduce/updates/update_admin_edit.webp';
import update_admin_stats from '@/assets/images/introduce/updates/update_admin_stats.webp';
import update_apply from '@/assets/images/introduce/updates/update_apply.webp';
import update_bottom_nav from '@/assets/images/introduce/updates/update_bottom_nav.webp';
import update_calendar from '@/assets/images/introduce/updates/update_calendar.webp';
import update_click_battle from '@/assets/images/introduce/updates/update_click_battle.webp';
import update_club_detail from '@/assets/images/introduce/updates/update_club_detail.webp';
import update_club_union from '@/assets/images/introduce/updates/update_club_union.webp';
import update_deadline_push from '@/assets/images/introduce/updates/update_deadline_push.webp';
import update_first_open from '@/assets/images/introduce/updates/update_first_open.webp';
import update_letterbox from '@/assets/images/introduce/updates/update_letterbox.webp';
import update_main_cards from '@/assets/images/introduce/updates/update_main_cards.webp';
import update_promotion_badge from '@/assets/images/introduce/updates/update_promotion_badge.webp';
import update_promotion_board from '@/assets/images/introduce/updates/update_promotion_board.webp';
import update_promotion_map from '@/assets/images/introduce/updates/update_promotion_map.webp';
import update_search from '@/assets/images/introduce/updates/update_search.webp';

/**
 * 이미지 규격(4:3 프레임 안에 놓는 방식)
 * - phone: 폰 화면 캡처(390px 폭, 2배율). 가운데 좁게 세우고 아래는 자른다
 * - panel: 실제 컴포넌트 화면 한 칸 캡처. 넓게 세우고 아래는 자른다
 * - mockup: 이미 폰 틀이 그려진 이미지. 잘리지 않게 프레임 높이에 맞춘다
 */
export type UpdateImageKind = 'phone' | 'panel' | 'mockup';

export interface UpdateEntry {
  /** YYYY-MM-DD. 2026년 3월부터는 릴리스 태그일, 그 전은 main 머지일 */
  date: string;
  title: string;
  description: string;
  image: { src: string; alt: string; kind: UpdateImageKind };
}

export const UPDATE_ENTRIES: readonly UpdateEntry[] = [
  {
    date: '2026-10-29',
    title: '홍보 탭에 새 글 수가 보여요',
    description:
      '하단 메뉴의 홍보 탭에 아직 안 본 새 홍보 글 개수를 숫자로 알려 드려요. 공연과 행사 소식을 놓치지 마세요.',
    image: {
      src: update_promotion_badge,
      alt: '하단 메뉴 홍보 탭',
      kind: 'phone',
    },
  },
  {
    date: '2026-09-19',
    title: '운영진이 직접 홍보 글을 올려요',
    description:
      '동아리 관리자가 공연·행사 글을 직접 쓰고 고칠 수 있어요. 행사 장소도 지도에서 바로 찍어 학생들이 찾아오기 쉬워요.',
    image: {
      src: update_promotion_map,
      alt: '행사 장소 지도가 있는 홍보 글',
      kind: 'phone',
    },
  },
  {
    date: '2026-08-28',
    title: '휴대폰으로도 지원자를 관리해요',
    description:
      '지원서 목록, 지원자 현황, 지원서 상세를 휴대폰 화면에 맞게 새로 만들었어요. 이동 중에도 서류를 보고 결과를 바꿀 수 있어요.',
    image: {
      src: update_admin_applicants,
      alt: '휴대폰 지원자 현황 화면',
      kind: 'panel',
    },
  },
  {
    date: '2026-08-23',
    title: '모아동 우체통이 열렸어요',
    description:
      '바라는 점, 불편한 점, 응원 한마디를 모아동 팀에게 편지로 보내 주세요. 답장이 오면 알림으로 알려 드려요.',
    image: {
      src: update_letterbox,
      alt: '모아동 우체통 받은 편지함',
      kind: 'phone',
    },
  },
  {
    date: '2026-08-15',
    title: '동아리 일정을 달력으로 보여 줘요',
    description:
      '운영진이 Google 캘린더나 Notion을 연결하거나 일정을 직접 추가하면, 동아리 페이지 달력에 모임과 행사가 나타나요.',
    image: {
      src: update_calendar,
      alt: '동아리 페이지 일정 달력',
      kind: 'panel',
    },
  },
  {
    date: '2026-07-28',
    title: '우리 동아리 통계를 확인해요',
    description:
      '동아리 페이지 방문과 지원 현황을 관리자 페이지에서 기간별로 한눈에 볼 수 있어요.',
    image: { src: update_admin_stats, alt: '관리자 통계 화면', kind: 'panel' },
  },
  {
    date: '2026-07-28',
    title: 'AI가 지원서 초안을 만들어 줘요',
    description:
      '버튼 한 번이면 AI가 지원서 질문 초안을 만들어 줘요. 다듬어서 그대로 쓰면 돼요.',
    image: {
      src: update_admin_ai,
      alt: 'AI가 만든 지원서 초안',
      kind: 'panel',
    },
  },
  {
    date: '2026-07-02',
    title: '휴대폰으로 동아리 정보를 고쳐요',
    description:
      '관리자가 휴대폰에서도 기본 정보, 태그, 링크, 소개를 고칠 수 있어요. 저장하면 학생 화면에 바로 반영돼요.',
    image: {
      src: update_admin_edit,
      alt: '동아리 소개 수정 화면',
      kind: 'panel',
    },
  },
  {
    date: '2026-06-14',
    title: '웹에도 하단 메뉴가 생겼어요',
    description:
      '모바일 웹에서도 앱처럼 하단 메뉴로 홈, 구독, 홍보, 메뉴를 오갈 수 있어요.',
    image: {
      src: update_bottom_nav,
      alt: '모바일 웹 하단 메뉴',
      kind: 'phone',
    },
  },
  {
    date: '2026-05-03',
    title: '동아리 클릭 배틀이 열렸어요',
    description:
      '응원하는 동아리 버튼을 눌러 실시간 순위를 겨루는 이벤트 게임이었어요. 7월 초 최종 순위를 공개하고 마무리했어요.',
    image: {
      src: update_click_battle,
      alt: '클릭 배틀 최종 순위',
      kind: 'phone',
    },
  },
  {
    date: '2026-04-05',
    title: '홍보 게시판이 생겼어요',
    description:
      '동아리 공연, 전시, 행사 소식을 한곳에 모은 홍보 게시판이 열렸어요.',
    image: {
      src: update_promotion_board,
      alt: '홍보 게시판 목록',
      kind: 'phone',
    },
  },
  {
    date: '2026-02-13',
    title: '모집 마감 전에 알려 드려요',
    description:
      '구독한 동아리의 모집 마감 7일, 3일, 1일 전에 앱 알림을 보내 드려요. 지원을 미루다 놓치는 일이 없어요.',
    image: {
      src: update_deadline_push,
      alt: '잠금화면의 모집 알림',
      kind: 'panel',
    },
  },
  {
    date: '2026-02-09',
    title: '비슷한 말로도 찾아 줘요',
    description:
      '동아리 이름을 정확히 몰라도 비슷한 말로 검색하면 관련 동아리를 찾아 줘요.',
    image: { src: update_search, alt: '보드 검색 결과', kind: 'phone' },
  },
  {
    date: '2025-12-26',
    title: '동아리 페이지가 새로워졌어요',
    description:
      '커버 이미지, 소개, FAQ, 활동사진이 들어간 새 동아리 페이지로 바뀌었어요. 활동사진도 여러 장을 한 번에 올릴 수 있어요.',
    image: {
      src: update_club_detail,
      alt: '새 동아리 상세 페이지',
      kind: 'phone',
    },
  },
  {
    date: '2025-12-19',
    title: '모아동 앱이 나왔어요',
    description:
      'iOS와 Android 앱이 나왔어요. 관심 동아리를 구독하면 모집 소식을 알림으로 받아 볼 수 있어요.',
    image: {
      src: introduce_main_screen,
      alt: '모아동 앱 홈 화면',
      kind: 'phone',
    },
  },
  {
    date: '2025-11-09',
    title: '메인 화면이 새로워졌어요',
    description:
      '동아리 카드와 분과 버튼 디자인을 새로 바꾸고, 검색 결과 개수도 보여 드려요.',
    image: {
      src: update_main_cards,
      alt: '새 메인 화면 동아리 카드',
      kind: 'phone',
    },
  },
  {
    date: '2025-08-19',
    title: '총동아리연합회 페이지가 생겼어요',
    description:
      '총동아리연합회를 소개하고 연락할 수 있는 페이지가 새로 생겼어요.',
    image: {
      src: update_club_union,
      alt: '총동아리연합회 소개 페이지',
      kind: 'phone',
    },
  },
  {
    date: '2025-07-27',
    title: '모아동에서 바로 지원해요',
    description:
      '동아리가 만든 지원서로 모아동 안에서 바로 지원할 수 있어요. 지원서 링크를 따로 찾을 필요가 없어요.',
    image: { src: update_apply, alt: '모아동 지원서 작성 화면', kind: 'panel' },
  },
  {
    date: '2025-03-07',
    title: '모아동이 문을 열었어요',
    description:
      '부경대 동아리를 한곳에서 찾아보고 검색할 수 있는 모아동 웹이 처음 문을 열었어요.',
    image: {
      src: update_first_open,
      alt: '처음 문을 연 모아동 웹 화면',
      kind: 'mockup',
    },
  },
];
