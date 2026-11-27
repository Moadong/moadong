import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  useStudentProfile,
  useUpdateStudentProfile,
} from '@/hooks/Queries/useStudentProfile';
import useDevice from '@/hooks/useDevice';
import ProfileSetupPage from './ProfileSetupPage';

jest.mock('@/hooks/Queries/useStudentProfile', () => ({
  useStudentProfile: jest.fn(),
  useUpdateStudentProfile: jest.fn(),
}));

jest.mock('@/hooks/useDevice', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/utils/generateOnboardingNickname', () => ({
  __esModule: true,
  default: jest.fn(() => '테스트닉네임'),
}));

jest.mock('@/components/common/Header/Header', () => ({
  __esModule: true,
  default: () => <div data-testid='header' />,
}));

jest.mock('@/components/common/WebviewTopBar/WebviewTopBar', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const mockedUseStudentProfile = useStudentProfile as jest.Mock;
const mockedUseUpdateStudentProfile = useUpdateStudentProfile as jest.Mock;
const mockedUseDevice = useDevice as jest.Mock;

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProfileSetupPage />
    </MemoryRouter>,
  );

describe('ProfileSetupPage — 에러 상태', () => {
  beforeEach(() => {
    mockedUseDevice.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLaptop: false,
    });
    mockedUseUpdateStudentProfile.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it('조회 실패 시 안내 문구와 다시 시도 버튼이 표시된다', () => {
    const mockRefetch = jest.fn();
    mockedUseStudentProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    renderPage();

    expect(screen.getByText('프로필 정보를 불러오지 못했어요.')).not.toBeNull();
    expect(screen.getByText('다시 시도')).not.toBeNull();
  });

  it('다시 시도 버튼을 누르면 refetch가 호출된다', async () => {
    const mockRefetch = jest.fn();
    mockedUseStudentProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    renderPage();

    await userEvent.click(screen.getByText('다시 시도'));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('모바일 에러 화면에 WebviewTopBar가 표시된다', () => {
    mockedUseStudentProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    });

    renderPage();

    expect(screen.getByText('프로필 설정')).not.toBeNull();
  });

  it('데스크탑 에러 화면에 Header가 표시된다', () => {
    mockedUseDevice.mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLaptop: false,
    });
    mockedUseStudentProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
    });

    renderPage();

    expect(screen.getByTestId('header')).not.toBeNull();
  });
});
