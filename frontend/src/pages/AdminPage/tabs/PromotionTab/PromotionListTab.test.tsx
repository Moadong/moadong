import '@testing-library/jest-dom';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { PromotionArticle } from '@/types/promotion';
import PromotionListTab from './PromotionListTab';

// apis 체인이 import.meta.env를 써서 ts-jest에서 파싱되지 않아 훅만 대체한다
const mockDelete = jest.fn();
const mockArticles: PromotionArticle[] = [];
jest.mock('@/hooks/Queries/usePromotion', () => ({
  useGetPromotionArticles: () => ({
    data: mockArticles,
    isLoading: false,
    isError: false,
    error: null,
  }),
  useDeletePromotionArticle: () => ({ mutate: mockDelete, isPending: false }),
}));
jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => () => jest.fn());
jest.mock('@/hooks/Mixpanel/useTrackPageView', () => () => {});
jest.mock('@/hooks/useDevice', () => () => ({
  isMobile: false,
  isTablet: false,
  isLaptop: false,
  isDesktop: true,
}));

const makeArticle = (
  overrides: Partial<PromotionArticle> &
    Pick<PromotionArticle, 'id' | 'clubId'>,
): PromotionArticle => ({
  clubName: '동아리',
  title: `제목 ${overrides.id}`,
  location: '한울관(E31)',
  latitude: 35.13,
  longitude: 129.1,
  eventStartDate: '2026-04-01T01:00:00Z',
  eventEndDate: '2026-04-01T03:00:00Z',
  description: '설명',
  images: [],
  ...overrides,
});

// 상세 API는 state를 설명값('활성화'/'비활성화')으로 준다
const renderTab = (state = '활성화') => {
  render(
    <MemoryRouter initialEntries={['/admin/promotion']}>
      <Routes>
        <Route
          path='/admin'
          element={<Outlet context={{ id: 'my-club', state }} />}
        >
          <Route path='promotion' element={<PromotionListTab />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

beforeEach(() => {
  mockArticles.length = 0;
  mockDelete.mockReset();
  const root = document.createElement('div');
  root.id = 'modal-root';
  document.body.appendChild(root);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

describe('PromotionListTab', () => {
  it('내 동아리 글만 보여준다', () => {
    mockArticles.push(
      makeArticle({ id: 'mine', clubId: 'my-club' }),
      makeArticle({ id: 'other', clubId: 'other-club' }),
    );
    renderTab();

    expect(screen.getByText('제목 mine')).toBeInTheDocument();
    expect(screen.queryByText('제목 other')).not.toBeInTheDocument();
  });

  it('심사 전 동아리는 작성 버튼 대신 안내 문구를 보여준다', () => {
    renderTab('비활성화');

    expect(
      screen.queryByRole('button', { name: /새 게시글 작성/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        '심사가 완료된 동아리만 홍보 게시글을 작성할 수 있습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('삭제는 확인창을 거친 뒤에만 요청한다', () => {
    mockArticles.push(makeArticle({ id: 'mine', clubId: 'my-club' }));
    const confirmSpy = jest.spyOn(window, 'confirm');
    renderTab();

    confirmSpy.mockReturnValueOnce(false);
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(mockDelete).not.toHaveBeenCalled();

    confirmSpy.mockReturnValueOnce(true);
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(mockDelete).toHaveBeenCalledWith('mine', expect.any(Object));

    confirmSpy.mockRestore();
  });
});
