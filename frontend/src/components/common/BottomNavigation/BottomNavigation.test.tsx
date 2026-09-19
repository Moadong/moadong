import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import BottomNavigation from './BottomNavigation';

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
  it('홈·구독·홍보·메뉴 네 탭을 보여준다', () => {
    renderAt('/');

    const labels = screen
      .getAllByRole('button', { hidden: true })
      .map((tab) => tab.textContent);
    expect(labels).toEqual(['홈', '구독', '홍보', '메뉴']);
  });

  it('홈에서는 활성 탭이 홈 하나뿐이다', () => {
    renderAt('/');

    const activeTabs = screen
      .getAllByRole('button', { hidden: true })
      .filter((tab) => tab.getAttribute('aria-current') === 'page');

    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0].textContent).toBe('홈');
  });
});
