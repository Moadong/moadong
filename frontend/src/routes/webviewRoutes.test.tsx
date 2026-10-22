import {
  createMemoryRouter,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import webviewRoutes from './webviewRoutes';

const CurrentLocation = () => {
  const { pathname, search } = useLocation();
  return <div data-testid='location'>{`${pathname}${search}`}</div>;
};

const renderAt = (entry: string) => {
  const router = createMemoryRouter(
    [...webviewRoutes, { path: '*', element: <CurrentLocation /> }],
    { initialEntries: [entry] },
  );
  const { unmount } = render(<RouterProvider router={router} />);
  const location = screen.getByTestId('location').textContent;
  unmount();
  return location;
};

describe('webviewRoutes', () => {
  it('/webview/:slug?path= 는 path로 보낸다(앱이 없는 브라우저에서 연 QR 링크)', () => {
    expect(renderAt('/webview/peace?path=%2Fpeace%3Fsrc%3Dqr')).toBe(
      '/peace?src=qr',
    );
  });

  it('결과 공유 링크(path에 쿼리가 들어 있는 형태)를 그대로 되돌린다', () => {
    expect(
      renderAt(
        '/webview/peace?path=%2Fpeace%2Fresult%3Ftype%3Dcarer%26a%3D00000000%26src%3Dqr&hideHeader=true',
      ),
    ).toBe('/peace/result?type=carer&a=00000000&src=qr');
  });

  it('path가 없거나 사이트 내부 경로가 아니면 홈으로 보낸다', () => {
    expect(renderAt('/webview/peace')).toBe('/');
    expect(renderAt('/webview/peace?path=%2F%2Fevil.com')).toBe('/');
    expect(renderAt('/webview/peace?path=https%3A%2F%2Fevil.com')).toBe('/');
    expect(renderAt('/webview/peace?path=%2F%5Cevil.com')).toBe('/');
    expect(renderAt('/webview/peace?path=%2F%09%2Fevil.com')).toBe('/');
  });

  it('기존 구버전 앱 리다이렉트가 우선한다', () => {
    expect(renderAt('/webview/promotions?path=%2Fpeace')).toBe('/promotions');
    expect(renderAt('/webview/club/abc')).toBe('/clubDetail/abc');
  });
});
