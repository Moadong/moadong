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

export const RECRUIT_PERIOD = '모집 기간은 추후 공지해요';

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
      '동아리 탐색·지원·알림 흐름의 UX 설계와 UI 디자인',
      '디자인 시스템 컴포넌트 정리와 유지',
      '사용자 피드백과 지표를 보고 개선안 제안',
    ],
    qualifications: [
      'Figma로 화면과 컴포넌트를 설계할 수 있는 분',
      '개발자와 화면 구현을 함께 논의할 수 있는 분',
      '주 1회 정기 회의에 참여할 수 있는 분',
    ],
    preferred: [
      '실제 서비스나 프로젝트를 출시해 본 경험',
      '디자인 시스템을 만들거나 운영해 본 경험',
      '동아리 활동 경험',
    ],
    applicationFormId: '',
  },
  {
    id: 'developer',
    title: '개발자',
    summary:
      '웹 프론트엔드나 백엔드를 맡아 실제 사용자가 쓰는 기능을 만들어요.',
    responsibilities: [
      'React 웹 또는 Spring 백엔드 기능 개발',
      '코드 리뷰와 PR 기반 협업',
      '배포 이후 지표와 오류를 보고 개선',
    ],
    qualifications: [
      'TypeScript 또는 Java로 프로젝트를 만들어 본 분',
      'Git과 GitHub PR로 협업할 수 있는 분',
      '주 1회 정기 회의에 참여할 수 있는 분',
    ],
    preferred: [
      'React나 Spring으로 실무 또는 프로젝트를 해 본 경험',
      '운영 중인 서비스를 개선해 본 경험',
      '동아리 활동 경험',
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
  { step: '서류 접수', date: '추후 공지' },
  { step: '서류 발표', date: '추후 공지' },
  { step: '인터뷰', date: '추후 공지' },
  { step: '최종 발표', date: '추후 공지' },
] as const;
