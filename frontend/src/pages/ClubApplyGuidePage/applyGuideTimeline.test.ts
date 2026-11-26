// 지원 안내 타임라인이 모집 상태마다 맞는 순서·상태로 만들어지는지 검증하는 테스트
import {
  buildApplyTimeline,
  describeApplyMethod,
  withRo,
} from './applyGuideTimeline';

const NOW = new Date('2026-11-25T12:00:00+09:00');
const SCHEDULE = [
  { label: '면접', date: '12/3(목)', place: '동아리방' },
  { label: '합격 발표', date: '12/5(토)' },
];

describe('buildApplyTimeline', () => {
  it('모집 중이면 지금 지원 → 마감 → 이후 일정 순서다', () => {
    const items = buildApplyTimeline({
      status: 'OPEN',
      start: '2026.11.20 00:00',
      end: '2026.11.30 23:59',
      method: { kind: 'EXTERNAL', platform: '네이버 폼' },
      schedule: SCHEDULE,
      now: NOW,
    });
    expect(items.map((i) => [i.label, i.state])).toEqual([
      ['네이버 폼으로 지원', 'now'],
      ['지원 마감', 'next'],
      ['면접', 'next'],
      ['합격 발표', 'next'],
    ]);
    expect(items[1].date).toBe('11월 30일 (월) 23:59');
  });

  it('상시 모집이면 마감 단계를 넣지 않는다', () => {
    const items = buildApplyTimeline({
      status: 'ALWAYS',
      start: '2026.01.01 00:00',
      end: '2999.01.01 00:00',
      method: { kind: 'MOADONG' },
      now: NOW,
    });
    expect(items.map((i) => i.label)).toEqual(['모아동에서 지원서 작성']);
  });

  it('모집 전이면 모집 시작부터 보여준다', () => {
    const items = buildApplyTimeline({
      status: 'UPCOMING',
      start: '2026.12.01 10:00',
      end: '2026.12.10 00:00',
      method: { kind: 'MOADONG' },
      now: NOW,
    });
    expect(items[0]).toMatchObject({
      label: '모집 시작',
      date: '12월 1일 (화) 10:00',
      state: 'next',
    });
  });

  it('지난 모집이면 모든 단계를 지난 기록으로 표시한다', () => {
    const items = buildApplyTimeline({
      status: 'CLOSED',
      start: '2026.03.02 00:00',
      end: '2026.03.16 00:00',
      schedule: SCHEDULE,
      now: NOW,
    });
    expect(items.every((i) => i.state === 'done')).toBe(true);
    expect(items.map((i) => i.label)).toEqual([
      '모집 시작',
      '지원 마감',
      '면접',
      '합격 발표',
    ]);
  });
});

describe('describeApplyMethod', () => {
  it('지원서가 없으면 직접 연락하라고 말한다', () => {
    expect(describeApplyMethod({ kind: 'CONTACT' }).title).toBe(
      '동아리에 직접 연락',
    );
  });
});

describe('withRo', () => {
  it.each([
    ['네이버 폼', '네이버 폼으로'],
    ['외부 지원서', '외부 지원서로'],
    ['에브리타임', '에브리타임으로'],
    ['카톡방', '카톡방으로'],
    ['메일', '메일로'],
  ])('%s → %s', (word, expected) => {
    expect(withRo(word)).toBe(expected);
  });
});
