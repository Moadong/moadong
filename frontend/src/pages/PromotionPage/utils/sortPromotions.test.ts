import { PromotionArticle } from '@/types/promotion';
import { sortPromotions } from './sortPromotions';

const createArticle = (
  title: string,
  start: string,
  end: string,
): PromotionArticle => ({
  id: title,
  title,
  clubId: 'club',
  clubName: 'club',
  location: 'location',
  description: '',
  images: [],
  eventStartDate: start,
  eventEndDate: end,
});

describe('sortPromotions', () => {
  const NOW = new Date('2026-04-10T00:00:00Z').getTime();

  it('진행중 이벤트가 가장 위로 온다', () => {
    const ongoing = createArticle(
      'ongoing',
      '2026-04-09T00:00:00Z',
      '2026-04-11T00:00:00Z',
    );

    const upcoming = createArticle(
      'upcoming',
      '2026-04-12T00:00:00Z',
      '2026-04-13T00:00:00Z',
    );

    const result = sortPromotions([upcoming, ongoing], NOW);

    expect(result[0].title).toBe('ongoing');
  });

  it('예정 이벤트는 D-day 가까운 순으로 정렬된다', () => {
    const soon = createArticle(
      'soon',
      '2026-04-11T00:00:00Z',
      '2026-04-12T00:00:00Z',
    );

    const later = createArticle(
      'later',
      '2026-04-20T00:00:00Z',
      '2026-04-21T00:00:00Z',
    );

    const result = sortPromotions([later, soon], NOW);

    expect(result[0].title).toBe('soon');
  });

  it('종료 이벤트는 맨 아래로 간다', () => {
    const ended = createArticle(
      'ended',
      '2026-04-01T00:00:00Z',
      '2026-04-05T00:00:00Z',
    );

    const upcoming = createArticle(
      'upcoming',
      '2026-04-12T00:00:00Z',
      '2026-04-13T00:00:00Z',
    );

    const result = sortPromotions([ended, upcoming], NOW);

    expect(result[result.length - 1].title).toBe('ended');
  });

  it('종료 이벤트끼리는 최신순으로 정렬된다', () => {
    const old = createArticle(
      'old',
      '2026-04-01T00:00:00Z',
      '2026-04-02T00:00:00Z',
    );

    const recent = createArticle(
      'recent',
      '2026-04-05T00:00:00Z',
      '2026-04-06T00:00:00Z',
    );

    const result = sortPromotions([old, recent], NOW);

    expect(result[0].title).toBe('recent');
  });

  it('전체 정렬 순서: 진행중 → 예정 → 종료', () => {
    const ongoing = createArticle(
      'ongoing',
      '2026-04-09T00:00:00Z',
      '2026-04-11T00:00:00Z',
    );

    const upcoming = createArticle(
      'upcoming',
      '2026-04-12T00:00:00Z',
      '2026-04-13T00:00:00Z',
    );

    const ended = createArticle(
      'ended',
      '2026-04-01T00:00:00Z',
      '2026-04-02T00:00:00Z',
    );

    const result = sortPromotions([ended, upcoming, ongoing], NOW);

    expect(result.map((a) => a.title)).toEqual([
      'ongoing',
      'upcoming',
      'ended',
    ]);
  });
});
