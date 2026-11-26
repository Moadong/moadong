// 팀 공유용 미리보기에서 두 동아리(부경다이버·UCDC)를 실제 서버 스냅샷과 '모집 중' 상태로 덮어써 꽉 찬 화면을 보여준다
import { addDays, format, startOfDay, subDays } from 'date-fns';
import { clubShowcaseSnapshot } from '@/mocks/data/clubShowcaseSnapshot';
import type { ApplyGuideData } from '@/pages/ClubDetailPage/hooks/useApplyGuide';
import { ClubDetail, RecruitmentStatus } from '@/types/club';

const DATE_FORMAT = 'yyyy.MM.dd HH:mm';

/** 그날 23:59 */
const endOfDayMinute = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 0, 0);
  return result;
};

interface RecruitmentPreset {
  status: RecruitmentStatus;
  /** 접속 시각 기준 모집 시작·마감 */
  start: (now: Date) => Date;
  end: (now: Date) => Date;
}

const PRESETS: Record<string, RecruitmentPreset> = {
  // 부경다이버: 모집 중, 마감까지 3일
  '67e54ae51cfd27718dd40be9': {
    status: 'OPEN',
    start: (now) => startOfDay(subDays(now, 7)),
    end: (now) => endOfDayMinute(addDays(now, 3)),
  },
  // UCDC: 오늘 밤 마감, 몇 시간 남음
  '6873bd299033815c4391192e': {
    status: 'OPEN',
    start: (now) => startOfDay(subDays(now, 10)),
    end: (now) => endOfDayMinute(now),
  },
};

const APPLY_GUIDES: Record<string, ApplyGuideData> = {
  '67e54ae51cfd27718dd40be9': {
    method: { kind: 'EXTERNAL', platform: '네이버 폼' },
    forms: [],
  },
  '6873bd299033815c4391192e': {
    method: { kind: 'EXTERNAL', platform: '네이버 폼' },
    forms: [],
  },
};

export const applyShowcaseOverride = (
  club: ClubDetail,
  now: Date = new Date(),
): ClubDetail => {
  const preset = PRESETS[club.id];
  const snapshot = clubShowcaseSnapshot[club.id];
  if (!preset || !snapshot) return club;

  return {
    ...club,
    ...snapshot,
    recruitmentStatus: preset.status,
    recruitmentStart: format(preset.start(now), DATE_FORMAT),
    recruitmentEnd: format(preset.end(now), DATE_FORMAT),
  };
};

export const getShowcaseApplyGuide = (clubId?: string) =>
  clubId ? APPLY_GUIDES[clubId] : undefined;
