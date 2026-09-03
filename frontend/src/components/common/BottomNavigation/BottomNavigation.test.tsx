import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import BottomNavigation from './BottomNavigation';

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const renderAt = (path: string, showClubsTab: boolean) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNavigation showClubsTab={showClubsTab} />
    </MemoryRouter>,
  );

describe('BottomNavigation', () => {
  it('개편을 받은 사용자에게는 홈·동아리·홍보·메뉴를 보여준다', () => {
    renderAt('/', true);

    const labels = screen.getAllByRole('button').map((tab) => tab.textContent);
    expect(labels).toEqual(['홈', '동아리', '홍보', '메뉴']);
  });

  it('개편을 받지 않은 사용자에게는 동아리 대신 구독 탭을 보여준다', () => {
    renderAt('/', false);

    const labels = screen.getAllByRole('button').map((tab) => tab.textContent);
    expect(labels).toEqual(['홈', '구독', '홍보', '메뉴']);
  });

  it('개편을 받지 않은 사용자의 홈에서는 활성 탭이 홈 하나뿐이다', () => {
    renderAt('/', false);

    const activeTabs = screen
      .getAllByRole('button')
      .filter((tab) => tab.getAttribute('aria-current') === 'page');

    expect(activeTabs).toHaveLength(1);
    expect(activeTabs[0].textContent).toBe('홈');
  });
});
