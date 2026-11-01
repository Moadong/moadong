import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { useVerifiedAdminClubId } from '@/hooks/Queries/useVerifiedAdminClubId';
import { useAdminClubStore } from '@/store/useAdminClubStore';
import { theme } from '@/styles/theme';
import ClubApplyButton from './ClubApplyButton';

const CLUB_ID = 'club-1';

// constants/api가 import.meta를 쓰는데 jest에서 파싱되지 않는다
jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

jest.mock('@/hooks/Queries/useClub', () => ({
  useGetClubDetail: () => ({
    data: {
      id: 'club-1',
      name: '모아동',
      recruitmentStatus: 'OPEN',
      recruitmentStart: '2026.10.01 00:00',
      recruitmentEnd: '2026.10.30 23:59',
    },
  }),
}));

jest.mock('@/hooks/Queries/useVerifiedAdminClubId', () => ({
  useVerifiedAdminClubId: jest.fn(),
}));

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock('@/hooks/useNavigator', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock('../AdminPeriodButton/AdminPeriodButton', () => ({
  __esModule: true,
  default: () => <div>관리자 기간 변경</div>,
}));

const mockVerified = useVerifiedAdminClubId as jest.Mock;

const renderButton = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/clubDetail/${CLUB_ID}`]}>
        <Routes>
          <Route path='/clubDetail/:clubId' element={<ClubApplyButton />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

beforeEach(() => {
  useAdminClubStore.setState({ clubId: CLUB_ID });
});

describe('ClubApplyButton 관리자 판정', () => {
  it('저장값이 있어도 토큰 확인 중이면 지원 버튼을 보여준다', () => {
    mockVerified.mockReturnValue({ data: undefined, isSuccess: false });
    renderButton();

    expect(screen.queryByText('관리자 기간 변경')).not.toBeInTheDocument();
    // 마감 문구와 한 버튼에 들어 있어 이름 일부로 찾는다
    expect(
      screen.getByRole('button', { name: /지원하기/ }),
    ).toBeInTheDocument();
  });

  it('재확인이 실패하면 직전 성공 data가 남아 있어도 지원 버튼을 보여준다', () => {
    mockVerified.mockReturnValue({
      data: CLUB_ID,
      isSuccess: false,
      isError: true,
    });
    renderButton();

    expect(screen.queryByText('관리자 기간 변경')).not.toBeInTheDocument();
  });

  it('확인값이 이 동아리면 관리자 버튼을 보여준다', () => {
    mockVerified.mockReturnValue({ data: CLUB_ID, isSuccess: true });
    renderButton();

    expect(screen.getByText('관리자 기간 변경')).toBeInTheDocument();
  });

  it('확인값이 다른 동아리면 지원 버튼을 보여준다', () => {
    mockVerified.mockReturnValue({ data: 'other-club', isSuccess: true });
    renderButton();

    expect(screen.queryByText('관리자 기간 변경')).not.toBeInTheDocument();
  });
});
