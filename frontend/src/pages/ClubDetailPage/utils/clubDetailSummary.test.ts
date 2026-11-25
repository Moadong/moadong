// 상세 화면 요약 정보 함수의 경계 조건을 검증하는 테스트
import { Award } from '@/types/club';
import {
  getDivisionLabel,
  getRecruitmentSummary,
  getSocialHandle,
  getUpdatedLabel,
  sortAwardsByLatest,
} from './clubDetailSummary';

// 2026-11-25 (수) 12:00 KST
const TODAY = new Date('2026-11-25T12:00:00+09:00');

describe('getRecruitmentSummary', () => {
  it('상시 모집은 기간 없이 언제든 지원 가능하다고 말한다', () => {
    const summary = getRecruitmentSummary(
      'ALWAYS',
      '2026.01.21 15:00',
      '2999.01.21 15:00',
      TODAY,
    );
    expect(summary).toEqual({
      label: '상시모집',
      detail: '언제든 지원할 수 있어요',
      isUrgent: false,
      period: null,
    });
  });

  it('모집중이면 D-day와 마감일을 보여주고 3일 이내면 강조한다', () => {
    const summary = getRecruitmentSummary(
      'OPEN',
      '2026.11.20 00:00',
      '2026.11.28 00:00',
      TODAY,
    );
    expect(summary.label).toBe('모집중');
    expect(summary.detail).toBe('D-3 · 11월 28일 (토) 마감');
    expect(summary.isUrgent).toBe(true);
    expect(summary.period).toBe('11월 20일 (금) ~ 11월 28일 (토)');
  });

  it('마감 당일은 D-Day로 표시한다', () => {
    const summary = getRecruitmentSummary(
      'OPEN',
      '2026.11.20 00:00',
      '2026.11.25 23:59',
      TODAY,
    );
    expect(summary.detail).toBe('D-Day · 11월 25일 (수) 마감');
  });

  it('모집중이어도 종료일이 1년 넘게 남으면 상시 모집처럼 다룬다', () => {
    const summary = getRecruitmentSummary(
      'OPEN',
      '2026.01.01 00:00',
      '2999.01.01 00:00',
      TODAY,
    );
    expect(summary.label).toBe('모집중');
    expect(summary.period).toBeNull();
  });

  it('모집예정이면 시작 시각을 알려준다', () => {
    const summary = getRecruitmentSummary(
      'UPCOMING',
      '2026.12.01 10:00',
      '2026.12.10 00:00',
      TODAY,
    );
    expect(summary.detail).toBe('12월 1일 (화) 10:00 시작');
  });

  it('모집마감은 언제 끝났는지 알려준다', () => {
    const summary = getRecruitmentSummary(
      'CLOSED',
      '2026.03.02 00:00',
      '2026.03.15 00:00',
      TODAY,
    );
    expect(summary.label).toBe('모집마감');
    expect(summary.detail).toBe('2026년 3월 모집이 끝났어요');
  });

  it('날짜 형식이 깨져 있어도 화면을 깨뜨리지 않는다', () => {
    expect(() =>
      getRecruitmentSummary('OPEN', '미정', 'not-a-date', TODAY),
    ).not.toThrow();
    expect(getRecruitmentSummary('OPEN', '미정', '', TODAY).detail).toBeNull();
  });
});

describe('sortAwardsByLatest', () => {
  it('최신 학기부터 정렬하고 빈 항목은 뺀다', () => {
    const awards: Award[] = [
      { year: 2022, semesterTerm: 'SECOND', achievements: ['A'] },
      { year: 2025, semesterTerm: 'FIRST', achievements: ['B'] },
      { year: 2025, semesterTerm: 'SECOND', achievements: ['C'] },
      { year: 2024, semesterTerm: 'FIRST', achievements: ['  '] },
    ];
    expect(sortAwardsByLatest(awards).map((a) => a.achievements[0])).toEqual([
      'C',
      'B',
      'A',
    ]);
  });
});

describe('getUpdatedLabel', () => {
  it.each([
    ['2026.11.25 09:00', '오늘 업데이트'],
    ['2026.11.22 09:00', '3일 전 업데이트'],
    ['2026.11.08 09:00', '2주 전 업데이트'],
    ['2026.03.03 14:27', '2026년 3월 3일 업데이트'],
  ])('%s → %s', (value, expected) => {
    expect(getUpdatedLabel(value, TODAY)).toBe(expected);
  });

  it('값이 없으면 null', () => {
    expect(getUpdatedLabel(undefined, TODAY)).toBeNull();
  });
});

describe('getDivisionLabel / getSocialHandle', () => {
  it('분과 약칭을 풀어 쓴다', () => {
    expect(getDivisionLabel('중동')).toBe('중앙동아리');
    expect(getDivisionLabel('과동')).toBe('과동아리');
    expect(getDivisionLabel('')).toBeNull();
  });

  it('SNS 주소에서 계정명만 남긴다', () => {
    expect(
      getSocialHandle('https://www.instagram.com/pknu_hurrah/?igsh=x'),
    ).toBe('pknu_hurrah');
  });
});
