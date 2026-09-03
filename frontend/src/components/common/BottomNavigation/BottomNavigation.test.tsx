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
  it('개편을 받은 사용자(/clubs)에게는 홈·동아리·홍보·메뉴를 보여준다', () => {
    mockUseClubListPath.mockReturnValue('/clubs');
    renderAt('/');

    const labels = screen.getAllByRole('button').map((tab) => tab.textContent);
    expect(labels).toEqual(['홈', '동아리', '홍보', '메뉴']);
  });

  it('개편을 받지 않은 사용자(/)에게는 동아리 대신 구독 탭을 보여준다', () => {
    mockUseClubListPath.mockReturnValue('/');
    renderAt('/');

    const labels = screen.getAllByRole('button').map((tab) => tab.textContent);
    expect(labels).toEqual(['홈', '구독', '홍보', '메뉴']);
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
