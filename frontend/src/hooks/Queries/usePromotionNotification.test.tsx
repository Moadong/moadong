import { MemoryRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import usePromotionNotification from '@/hooks/Queries/usePromotionNotification';
import { PromotionArticle } from '@/types/promotion';

const mockUseGetPromotionArticles = jest.fn();

jest.mock('@/hooks/Queries/usePromotion', () => ({
  useGetPromotionArticles: () => mockUseGetPromotionArticles(),
}));

const STORAGE_KEY = 'promotion_last_checked_time';

const OLD_ID = '600000000000000000000000';
const NEW_ID_1 = '650000000000000000000000';
const NEW_ID_2 = '660000000000000000000000';
const OLD_TIME = parseInt('60000000', 16) * 1000;
const NEW_TIME_2 = parseInt('66000000', 16) * 1000;

const mockArticle = {
  id: 'club-fest-2026',
  eventStartDate: '2099-03-19T00:00:00.000Z',
};

const setArticles = (data: Partial<PromotionArticle>[] | undefined) => {
  mockUseGetPromotionArticles.mockReturnValue({ data });
};

const renderAt = (path: string) =>
  renderHook(() => usePromotionNotification(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
    ),
  });

describe('usePromotionNotification', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseGetPromotionArticles.mockReset();
  });

  it('데이터가 없거나 빈 배열이면 0이다', () => {
    setArticles(undefined);
    expect(renderAt('/').result.current).toBe(0);

    setArticles([]);
    expect(renderAt('/').result.current).toBe(0);
  });

  it('목업 글만 있으면 첫 방문이어도 0이고 마지막 확인 시각을 저장하지 않는다', () => {
    setArticles([mockArticle]);

    expect(renderAt('/').result.current).toBe(0);
    expect(renderAt('/promotions').result.current).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("첫 방문(저장값 없음)이고 서버 글이 있으면 'dot'이다", () => {
    setArticles([mockArticle, { id: OLD_ID }]);

    expect(renderAt('/').result.current).toBe('dot');
  });

  it('재방문이면 마지막 확인 이후 생성된 서버 글 수를 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, String(OLD_TIME));
    setArticles([
      mockArticle,
      { id: OLD_ID },
      { id: NEW_ID_1 },
      { id: NEW_ID_2 },
    ]);

    expect(renderAt('/').result.current).toBe(2);
  });

  it('재방문이어도 새 글이 없으면 0이다', () => {
    localStorage.setItem(STORAGE_KEY, String(OLD_TIME));
    setArticles([{ id: OLD_ID }]);

    expect(renderAt('/').result.current).toBe(0);
  });

  it('/promotions에서는 서버 글의 최신 생성 시각을 저장하고 0을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, String(OLD_TIME));
    setArticles([mockArticle, { id: OLD_ID }, { id: NEW_ID_2 }]);

    expect(renderAt('/promotions').result.current).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(String(NEW_TIME_2));
  });
});
