import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import BottomNavigation from './BottomNavigation';

const mockUseClubListPath = jest.fn();

jest.mock('@/hooks/useClubListPath', () => ({
  __esModule: true,
  default: () => mockUseClubListPath(),
}));

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNavigation />
    </MemoryRouter>,
  );

describe('BottomNavigation', () => {
  it('개편을 받은 사용자(/clubs)에게는 동아리 탭을 보여준다', () => {
    mockUseClubListPath.mockReturnValue('/clubs');
    renderAt('/');

    expect(screen.getByRole('button', { name: '동아리' })).not.toBeNull();
  });

  it('개편을 받지 않은 사용자(/)에게는 동아리 탭을 숨긴다', () => {
    mockUseClubListPath.mockReturnValue('/');
    renderAt('/');

    expect(screen.queryByRole('button', { name: '동아리' })).toBeNull();
    expect(screen.getByRole('button', { name: '홈' })).not.toBeNull();
    expect(screen.getByRole('button', { name: '홍보' })).not.toBeNull();
    expect(screen.getByRole('button', { name: '메뉴' })).not.toBeNull();
  });

  it('개편을 받지 않은 사용자의 홈에서는 활성 탭이 홈 하나뿐이다', () => {
    mockUseClubListPath.mockReturnValue('/');
    renderAt('/');

    const activeTabs = screen
      .getAllByRole('button')
      .filter((tab) => tab.getAttribute('aria-current') === 'page');

    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0].textContent).toBe('홈');
  });
});
