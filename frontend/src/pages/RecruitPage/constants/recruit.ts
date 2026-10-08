// 문구·일정은 확정 전 초안이다. 운영진이 확정하면 이 파일만 고친다.

export const RECRUIT_PAGE_TITLE = '팀원 모집';

export const RECRUIT_HERO_TITLE = '모아동을 함께 만들\n팀원을 찾아요';

export const RECRUIT_HERO_DESCRIPTION =
  '동아리를 찾고, 지원하고, 소식을 받는 모든 과정을 모아동에서.\n학생들의 동아리 생활을 더 쉽게 만들 디자이너와 개발자를 모집해요.';

/**
 * 지원서를 받을 모아동 동아리 id. 메인에 노출되지 않도록 state가 UNAVAILABLE인 동아리여야 한다.
 * 동아리 정보 저장을 누르면 AVAILABLE로 바뀌어 메인에 뜨므로 관리자 화면에서 저장하지 않는다.
 */
export const MOADONG_CLUB_ID: string = '';

export const RECRUIT_PERIOD = '2026년 10월 15일(목) ~ 11월 30일(월) 23:59 모집';

export const RECRUIT_PERIOD_NOTE = '* 합격자가 나오면 조기 마감될 수 있어요.';

export interface RecruitStat {
  label: string;
  value: number;
  unit: string;
  desc: string;
  /** "약 18,000번"처럼 근사값 앞에 붙일 말 */
  prefix?: string;
  /** 포인트 컬러(--accent)로 칠할 숫자. 섹션에 하나만 둔다 */
  highlight?: boolean;
}

export const RECRUIT_STATS_TITLE = '숫자로 보는 모아동';

export const RECRUIT_STATS_PERIOD = '최근 12개월';

export const RECRUIT_STATS: readonly RecruitStat[] = [
  {
    label: '메인 방문자',
    value: 12848,
    unit: '명',
    desc: '모아동 메인을 방문했어요',
  },
  {
    label: '동아리 탐색',
    value: 8995,
    unit: '명',
    desc: '동아리 상세 페이지까지 살펴봤어요',
  },
  {
    label: '3월 모집 시즌',
    value: 6312,
    unit: '명',
    desc: '한 달 동안 찾아왔어요',
    highlight: true,
  },
  {
    label: '지원하기 클릭',
    value: 18000,
    unit: '번',
    prefix: '약',
    desc: '지원하기 버튼이 눌렸어요',
  },
  {
    label: '등록 동아리',
    value: 69,
    unit: '개',
    desc: '동아리가 모아동에 있어요',
  },
];

export const RECRUIT_STATS_CLOSING =
  "학교 공식 서비스가 아닌데도, 모집 시즌이면 부경대 학생들이 동아리를 찾을 때 모아동을 열어요.\n이제는 '시즌에만 여는 서비스'를 넘어 '1년 내내 동아리와 학생을 잇는 서비스'로 가려고 해요.";

export type RecruitPositionId = 'designer' | 'developer';

export interface RecruitPosition {
  id: RecruitPositionId;
  title: string;
  summary: string;
  responsibilities: readonly string[];
  qualifications: readonly string[];
  preferred: readonly string[];
  /** 비어 있으면 지원 버튼을 막는다 */
  applicationFormId: string;
}

export const RECRUIT_POSITIONS: readonly RecruitPosition[] = [
  {
    id: 'designer',
    title: '디자이너',
    summary: '학생과 동아리 운영진이 쓰는 웹·앱 화면을 설계해요.',
    responsibilities: [
      '모아동 앱 UI/UX 디자인 및 사용자 경험 개선',
      '서비스 기능과 사용자 흐름을 고려한 화면 설계',
      '디자인 시스템 구축 및 UI 컴포넌트 관리',
      '개발자와 협업하여 디자인 구현 및 UI 디테일 조율',
      '사용자 피드백과 서비스 데이터를 바탕으로 UX 개선 방향 제안',
    ],
    qualifications: [
      'Figma 등을 활용해 앱 또는 웹 UI/UX 디자인 프로젝트를 진행해 본 분',
      '주 1회 정기 회의에 참여할 수 있는 분',
    ],
    preferred: [
      '실제 서비스 출시 또는 운영 경험이 있는 분',
      '동아리 등 팀 프로젝트에서 디자이너로 협업한 경험이 있는 분',
      '사용자 관점에서 문제를 정의하고 디자인으로 해결해 본 분',
      '서비스 기획 단계부터 참여하거나 디자인 방향을 주도적으로 제안해 본 분',
    ],
    applicationFormId: '',
  },
  {
    id: 'developer',
    title: '개발자',
    summary:
      '웹 프론트엔드나 백엔드를 맡아 실제 사용자가 쓰는 기능을 만들어요.',
    responsibilities: [
      '프론트: React 기능 개발, 디자인 시스템',
      '백엔드: Spring API 개발, Docker·K8s 운영, GitOps·GitHub Actions로 배포 자동화',
      '공통: PR 기반 코드 리뷰, Observability 구축과 지표 기반 개선, Agent 커맨드·훅·스킬 개발',
    ],
    qualifications: [
      'React·TypeScript 또는 Spring·Java로 프로젝트를 만들어 본 분',
      '한 학기 이상 꾸준히 참여할 수 있는 분',
      '주 1회 정기 회의에 참여할 수 있는 분',
    ],
    preferred: [
      '서비스를 배포하거나 운영해 본 분',
      '전환율, 이탈률 같은 지표로 개선 방향을 잡아 본 분',
      '동아리 활동 경험이 있는 분',
      '서비스를 주도적으로 이끌어 본 분',
    ],
    applicationFormId: '',
  },
];

export const RECRUIT_VALUES = [
  {
    title: '사용자에서 출발해요',
    description: '학생과 운영진이 실제로 겪는 불편에서 문제를 찾아요.',
  },
  {
    title: '끝까지 책임져요',
    description: '맡은 기능을 출시하고 반응을 확인할 때까지 챙겨요.',
  },
  {
    title: '함께 결정해요',
    description: '근거를 나누고 직군을 넘어 같이 결정해요.',
  },
] as const;

export const RECRUIT_SCHEDULE = [
  { step: '서류 접수', date: '10.15(목) ~ 11.30(월)' },
  { step: '인터뷰', date: '지원자와 일정 조율' },
  { step: '최종 발표', date: '지원자와 일정 조율' },
] as const;
