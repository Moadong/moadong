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
const mockDevice = {
  isMobile: false,
  isTablet: false,
  isLaptop: false,
  isDesktop: true,
};
jest.mock('@/hooks/useDevice', () => () => mockDevice);

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

const renderTab = (state = 'AVAILABLE') =>
  render(
    <MemoryRouter initialEntries={['/admin/promotion']}>
      <Routes>
        <Route
          path='/admin'
          element={<Outlet context={{ id: 'my-club', state }} />}
        >
          <Route path='promotion' element={<PromotionListTab />} />
          <Route path='promotion/:articleId/edit' element={<p>수정 화면</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  Object.assign(mockDevice, {
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: true,
  });
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

  it('데스크톱은 텍스트가 보이는 작성 버튼을 쓴다', () => {
    renderTab();
    expect(screen.getByText('새 게시글 작성')).toBeInTheDocument();
  });

  it('컴팩트에서는 텍스트 없이 aria-label만 가진 플로팅 버튼을 쓴다', () => {
    mockDevice.isMobile = true;
    mockDevice.isDesktop = false;
    renderTab();

    const button = screen.getByRole('button', { name: '새 게시글 작성' });
    expect(button).toHaveTextContent('');
    expect(screen.queryByText('새 게시글 작성')).not.toBeInTheDocument();
  });

  it('심사 전 동아리는 작성 버튼 대신 안내 문구를 보여준다', () => {
    renderTab('UNAVAILABLE');

    expect(
      screen.queryByRole('button', { name: /새 게시글 작성/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        '심사가 완료된 동아리만 홍보 게시글을 작성할 수 있습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('카드 본문을 누르면 수정 화면으로 간다', () => {
    mockArticles.push(makeArticle({ id: 'mine', clubId: 'my-club' }));
    renderTab();

    fireEvent.click(screen.getByRole('button', { name: '제목 mine 수정' }));

    expect(screen.getByText('수정 화면')).toBeInTheDocument();
  });

  it('수정·삭제는 카드 우측 상단 메뉴를 열어야 나온다', () => {
    mockArticles.push(makeArticle({ id: 'mine', clubId: 'my-club' }));
    renderTab();

    expect(screen.queryByText('삭제')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: '제목 mine 관리 메뉴' }),
    );
    expect(screen.getByText('수정하기')).toBeInTheDocument();
    expect(screen.getByText('삭제')).toBeInTheDocument();
  });

  it('메뉴 바깥을 누르면 닫힌다', () => {
    mockArticles.push(makeArticle({ id: 'mine', clubId: 'my-club' }));
    renderTab();

    fireEvent.click(
      screen.getByRole('button', { name: '제목 mine 관리 메뉴' }),
    );
    expect(screen.getByText('삭제')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('삭제')).not.toBeInTheDocument();
  });

  it('삭제는 확인창을 거친 뒤에만 요청한다', () => {
    mockArticles.push(makeArticle({ id: 'mine', clubId: 'my-club' }));
    const confirmSpy = jest.spyOn(window, 'confirm');
    renderTab();

    fireEvent.click(
      screen.getByRole('button', { name: '제목 mine 관리 메뉴' }),
    );

    // 취소하면 요청도 안 가고 메뉴도 그대로 열려 있다
    confirmSpy.mockReturnValueOnce(false);
    fireEvent.click(screen.getByText('삭제'));
    expect(mockDelete).not.toHaveBeenCalled();
    expect(screen.getByText('삭제')).toBeInTheDocument();

    confirmSpy.mockReturnValueOnce(true);
    fireEvent.click(screen.getByText('삭제'));
    expect(mockDelete).toHaveBeenCalledWith('mine', expect.any(Object));

    confirmSpy.mockRestore();
  });
});
