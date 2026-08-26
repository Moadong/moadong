import BugIcon from '@/assets/images/icons/feedback/feedback_type_bug.svg?react';
import CheerIcon from '@/assets/images/icons/feedback/feedback_type_cheer.svg?react';
import FeatureIcon from '@/assets/images/icons/feedback/feedback_type_feature.svg?react';
import QuestionIcon from '@/assets/images/icons/feedback/feedback_type_question.svg?react';
import { colors } from '@/styles/theme/colors';
import type {
  FeedbackType,
  LetterCategory,
  SentFeedbackStatus,
} from '@/types/feedback';

export const FEEDBACK_CONTENT_MIN_LENGTH = 10;
export const FEEDBACK_CONTENT_MAX_LENGTH = 300;
export const FEEDBACK_IMAGE_MAX_COUNT = 4;

export const FEEDBACK_CONTENT_PLACEHOLDER = `내용은 최소 ${FEEDBACK_CONTENT_MIN_LENGTH}자, 최대 ${FEEDBACK_CONTENT_MAX_LENGTH}자 이하까지 작성 가능하며, 사진은 최대 ${FEEDBACK_IMAGE_MAX_COUNT}장까지 등록 가능합니다`;

interface FeedbackTypeMeta {
  /** 유형 선택 화면의 카드 라벨 */
  cardLabel: string;
  /** 작성 화면 상단 태그 라벨 */
  tagLabel: string;
  /** 작성 화면 제목 */
  title: string;
  /** 작성 화면 안내 문구 */
  description: string;
  /** 카드 그라데이션 시작 색 · 태그 배경 색 */
  backgroundColor: string;
  /** 태그 글자 색 */
  accentColor: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const FEEDBACK_TYPE_META: Record<FeedbackType, FeedbackTypeMeta> = {
  BUG: {
    cardLabel: '문제 신고하기',
    tagLabel: '문제 신고',
    title: '어떤 문제가 발생했나요?',
    description: '오류가 발생한 상황이나 불편했던 점을 자세히 알려주세요.',
    backgroundColor: colors.secondary[1].back,
    accentColor: colors.secondary[1].main,
    Icon: BugIcon,
  },
  FEATURE: {
    cardLabel: '신규 기능 요청하기',
    tagLabel: '신규 기능',
    title: '어떤 기능이 있으면 좋을까요?',
    description:
      '제안하고 싶으신 기능과 그 기능이 필요한 이유 등 자유롭게 적어주세요',
    backgroundColor: colors.secondary[2].back,
    accentColor: colors.secondary[2].main,
    Icon: FeatureIcon,
  },
  QUESTION: {
    cardLabel: '궁금한 점 문의하기',
    tagLabel: '궁금한 점',
    title: '무엇이 궁금하신가요?',
    description:
      '서비스 이용 중 궁금한 점이나 도움이 필요한 내용을 작성해 주세요.',
    backgroundColor: colors.secondary[4].back,
    accentColor: colors.secondary[4].main,
    Icon: QuestionIcon,
  },
  CHEER: {
    cardLabel: '모아동 응원하기',
    tagLabel: '응원하기',
    title: '응원의 한마디를 남겨주세요',
    description:
      '응원 메시지나 칭찬, 서비스 이용 후기를 자유롭게 작성해 주세요.',
    backgroundColor: colors.secondary[3].back,
    accentColor: colors.secondary[3].main,
    Icon: CheerIcon,
  },
};

export const FEEDBACK_TYPE_ORDER: FeedbackType[] = [
  'BUG',
  'FEATURE',
  'QUESTION',
  'CHEER',
];

interface TagMeta {
  label: string;
  backgroundColor: string;
  color: string;
}

/** 받은 편지 분류. 필터 칩과 목록/상세의 태그에 함께 쓴다 */
export const LETTER_CATEGORY_META: Record<LetterCategory, TagMeta> = {
  REPLY: {
    label: '답장',
    backgroundColor: colors.secondary[2].back,
    color: colors.secondary[2].main,
  },
  UPDATE: {
    label: '업데이트',
    backgroundColor: colors.accent[1][500],
    color: colors.accent[1][900],
  },
  STORY: {
    label: '이야기',
    backgroundColor: colors.secondary[6].back,
    color: colors.secondary[6].main,
  },
};

export const LETTER_CATEGORY_ORDER: LetterCategory[] = [
  'REPLY',
  'UPDATE',
  'STORY',
];

/** 보낸 편지의 처리 상태 태그 */
export const SENT_STATUS_META: Record<SentFeedbackStatus, TagMeta> = {
  PENDING: {
    label: '확인 중',
    backgroundColor: colors.gray[200],
    color: colors.gray[900],
  },
  REPLIED: {
    label: '답장 도착',
    backgroundColor: colors.accent[1][600],
    color: colors.accent[1][900],
  },
};
