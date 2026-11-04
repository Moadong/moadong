import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import BottomNavigation from './BottomNavigation';

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const renderAt = (path: string, promotionNotification?: number | 'dot') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNavigation promotionNotification={promotionNotification} />
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

  describe('홍보 탭 알림', () => {
    it('알림이 없으면 홍보 탭은 라벨 그대로의 이름을 가진다', () => {
      renderAt('/');

      const tab = screen.getByRole('button', { name: '홍보', hidden: true });
      expect(tab).not.toHaveAttribute('aria-label');
    });

    it('0이면 알림이 없는 것과 같다', () => {
      renderAt('/', 0);

      const tab = screen.getByRole('button', { name: '홍보', hidden: true });
      expect(tab).not.toHaveAttribute('aria-label');
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it("'dot'이면 '새 글 있음'으로 읽히고 숫자는 보이지 않는다", () => {
      renderAt('/', 'dot');

      expect(
        screen.getByRole('button', { name: '홍보, 새 글 있음', hidden: true }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/\d/)).not.toBeInTheDocument();
    });

    it('1~9는 숫자를 보여주고 새 글 N개로 읽힌다', () => {
      renderAt('/', 9);

      expect(screen.getByText('9')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '홍보, 새 글 9개', hidden: true }),
      ).toBeInTheDocument();
    });

    it('10 이상은 9+로 보여주고 새 글 9개 이상으로 읽힌다', () => {
      renderAt('/', 10);

      expect(screen.getByText('9+')).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: '홍보, 새 글 9개 이상',
          hidden: true,
        }),
      ).toBeInTheDocument();
    });

    it('홍보 외 탭은 알림이 있어도 이름이 그대로다', () => {
      renderAt('/', 3);

      for (const name of ['홈', '구독', '메뉴']) {
        expect(
          screen.getByRole('button', { name, hidden: true }),
        ).toBeInTheDocument();
      }
    });
  });
});
