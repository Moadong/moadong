import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import AdminProfile from './AdminProfile';

// apis 체인이 import.meta.env를 써서 ts-jest에서 파싱되지 않아 훅만 대체한다
let mockLogo = '';
jest.mock('@/hooks/Queries/useClub', () => ({
  useGetClubDetail: () => ({ data: { name: '테스트', logo: mockLogo } }),
}));
jest.mock('@/store/useAdminClubStore', () => ({
  useAdminClubId: () => ({ clubId: 'club-1' }),
}));

describe('AdminProfile', () => {
  it('로고가 없으면 이미지 대신 자리표시 원을 그린다', () => {
    mockLogo = '';
    render(<AdminProfile />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('admin-profile-placeholder')).toBeInTheDocument();
  });

  it('로고가 있으면 이미지를 그리고 자리표시 원은 없다', () => {
    mockLogo = 'https://cdn/logo.png';
    render(<AdminProfile />);

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://cdn/logo.png',
    );
    expect(
      screen.queryByTestId('admin-profile-placeholder'),
    ).not.toBeInTheDocument();
  });

  it('로고를 불러오지 못하면 alt 문구 대신 자리표시 원으로 바꾼다', () => {
    mockLogo = 'https://cdn/broken.png';
    render(<AdminProfile />);

    fireEvent.error(screen.getByRole('img'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('admin-profile-placeholder')).toBeInTheDocument();
  });
});
