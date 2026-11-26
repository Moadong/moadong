// 신입생이 동아리를 비교·판단할 수 있게 상세페이지에 더할 구조화 정보의 제안 계약 (아직 API 없음)

/** 관리자가 자유 글 대신 선택지로 고르는 '한눈에 보기' 사실 */
export interface ClubFacts {
  /** 예: "주 1~2회 · 토요일 시합" */
  meetingSchedule?: string;
  /** 회비(원). 0이면 무료. 학기마다 내는지 가입할 때 한 번 내는지 구분한다 */
  fee?: { amount: number; period: 'SEMESTER' | 'ONCE' };
  /** 회비 옆에 붙는 짧은 조건. 예: "신입 남 기준" */
  feeNote?: string;
  memberCount?: number;
  beginnerFriendly?: boolean;
  selection?: 'NONE' | 'DOCUMENT' | 'INTERVIEW' | 'AUDITION';
  /** 예: "장비 무료 대여" 처럼 신입이 걱정할 부분을 덜어주는 한 줄 */
  extraPerk?: { emoji: string; label: string };
}

/** 부원이 10초 만에 고르는 키워드 투표 결과. 관리자가 안 채워도 쌓인다 */
export interface ClubKeywordVote {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

export interface ClubKeywordSummary {
  participantCount: number;
  keywords: ClubKeywordVote[];
}

export interface ClubFit {
  goodFor: string[];
  thinkTwice: string[];
}

export interface ClubYearlyEvent {
  /** 1~12 */
  month: number;
  emoji: string;
  title: string;
}

export interface ClubJoinStep {
  emoji: string;
  title: string;
  description?: string;
}

export interface ClubMemberVoice {
  quote: string;
  /** 예: "23학번 · 기계공학과" */
  author: string;
  /** 예: "2년째 활동 중" */
  tenure?: string;
}

export interface ClubInsights {
  facts?: ClubFacts;
  keywords?: ClubKeywordSummary;
  fit?: ClubFit;
  yearlyEvents?: ClubYearlyEvent[];
  /** 지원한 다음 동아리가 진행하는 과정 (면접·발표·첫 모임 등). 지원 방법 자체는 지원서 설정에서 읽는다 */
  afterApplySteps?: ClubJoinStep[];
  memberVoices?: ClubMemberVoice[];
}
