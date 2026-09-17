import '@testing-library/jest-dom';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PromotionArticle } from '@/types/promotion';
import PromotionEditTab from './PromotionEditTab';

const mockArticles: PromotionArticle[] = [];
jest.mock('@/hooks/Queries/usePromotion', () => ({
  useGetPromotionArticles: () => ({
    data: mockArticles,
    isLoading: false,
    isError: false,
    error: null,
  }),
  useCreatePromotionArticle: () => ({ mutateAsync: jest.fn() }),
  useUpdatePromotionArticle: () => ({ mutateAsync: jest.fn() }),
  useUploadPromotionImages: () => ({ mutateAsync: jest.fn() }),
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
jest.mock(
  '@/components/map/MapLocationPicker/MapLocationPicker',
  () => () => <div />,
);
// react-datepicker의 css import를 jest가 파싱하지 못해 통째로 대체한다
jest.mock(
  '@/pages/AdminPage/tabs/RecruitEditTab/components/DateTimeRangePicker/DateTimeRangePicker',
  () => () => <div />,
);

const article: PromotionArticle = {
  id: 'a1',
  clubId: 'my-club',
  clubName: '동아리',
  title: '봄 정기공연',
  location: '한울관(E31)',
  latitude: 35.13,
  longitude: 129.1,
  eventStartDate: '2026-04-01T01:00:00Z',
  eventEndDate: '2026-04-01T03:00:00Z',
  description: '설명',
  images: ['https://cdn/a.png'],
};

const renderEditTab = (state: unknown, clubState = 'AVAILABLE') =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter
        initialEntries={[{ pathname: '/admin/promotion/a1/edit', state }]}
      >
        <Routes>
          <Route
            path='/admin'
            element={<Outlet context={{ id: 'my-club', state: clubState }} />}
          >
            <Route
              path='promotion/:articleId/edit'
              element={<PromotionEditTab />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

beforeEach(() => {
  Object.assign(mockDevice, {
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: true,
  });
  mockArticles.length = 0;
  mockArticles.push(article);
  const root = document.createElement('div');
  root.id = 'modal-root';
  document.body.appendChild(root);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

describe('PromotionEditTab 넘겨받은 토스트', () => {
  it('작성 중 이미지 업로드가 일부 실패해 넘어온 문구를 띄운다', () => {
    const message =
      '글은 저장됐지만 이미지 2장 업로드에 실패했어요. 다시 올려주세요.';

    renderEditTab({ toastMessage: message });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('넘어온 문구가 없으면 토스트를 띄우지 않는다', () => {
    renderEditTab(null);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('폼 잠금', () => {
  const PLACEHOLDERS = [
    '행사 제목을 입력해주세요',
    '예) 한솔관(E16) A동 208호',
    '행사 내용, 참여 방법, 준비물 등을 적어주세요',
  ];

  it('심사 전 동아리는 세 입력 필드가 모두 잠긴다', () => {
    renderEditTab(null, 'UNAVAILABLE');

    PLACEHOLDERS.forEach((placeholder) => {
      expect(screen.getByPlaceholderText(placeholder)).toBeDisabled();
    });
  });

  it('심사가 끝난 동아리는 입력할 수 있다', () => {
    renderEditTab(null);

    PLACEHOLDERS.forEach((placeholder) => {
      expect(screen.getByPlaceholderText(placeholder)).not.toBeDisabled();
    });
  });
});

describe('페이지 설명', () => {
  it('컴팩트에서는 이 화면이 무엇인지 알려준다', () => {
    mockDevice.isMobile = true;
    mockDevice.isDesktop = false;
    renderEditTab(null);

    expect(screen.getByText('행사 정보를 입력해주세요')).toBeInTheDocument();
    expect(
      screen.getByText('동아리 행사를 홍보하는 곳이에요'),
    ).toBeInTheDocument();
  });

  it('데스크톱에는 두지 않는다 - ContentSection 헤더가 제목을 이미 보여준다', () => {
    renderEditTab(null);

    expect(
      screen.queryByText('동아리 행사를 홍보하는 곳이에요'),
    ).not.toBeInTheDocument();
  });
});
