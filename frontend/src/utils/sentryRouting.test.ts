import { createElement, type ReactNode } from 'react';
import { matchRoutes, MemoryRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import {
  decodePathname,
  getSentryEnvironment,
  matchRoutesByOriginal,
  useDecodedLocation,
} from './sentryRouting';

const ROUTES = [{ path: '/clubDetail/:clubId' }];

const renderDecodedLocation = (pathname: string) =>
  renderHook(() => useDecodedLocation(), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(MemoryRouter, { initialEntries: [pathname] }, children),
  });

describe('sentryRouting', () => {
  // Sentry는 location.pathname과 matchRoutes 결과의 pathname이 같을 때만 라우트 이름을 쓴다.
  describe.each([
    ['한글', '테스트동아리'],
    ['&·+·공백', 'C&C 밴드+'],
    ['이름 안의 /', 'A/B팀'],
    ['리터럴 %20', 'A%20B'],
    ['리터럴 %25', '%25'],
    ['16진수가 아닌 %', '50%할인'],
  ])('%s 동아리명', (_, name) => {
    const encoded = `/clubDetail/@${encodeURIComponent(name)}`;

    it('Sentry가 비교하는 pathname과 매칭 결과의 pathname이 같다', () => {
      const { result } = renderDecodedLocation(encoded);
      const matches = matchRoutesByOriginal(ROUTES, result.current);

      expect(matches?.[0].route.path).toBe('/clubDetail/:clubId');
      expect(matches?.[0].pathname).toBe(result.current.pathname);
    });

    it('디코딩 결과가 원본 경로를 matchRoutes에 넣은 결과와 같다', () => {
      expect(decodePathname(encoded)).toBe(
        matchRoutes(ROUTES, encoded)?.[0].pathname,
      );
    });
  });

  it('같은 location에는 같은 객체를 돌려준다', () => {
    const { result, rerender } = renderDecodedLocation('/clubDetail/@abc');
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it('잘못된 퍼센트 시퀀스는 원본을 그대로 돌려준다', () => {
    expect(decodePathname('/clubDetail/%E0%A4%A')).toBe('/clubDetail/%E0%A4%A');
  });

  it.each([
    ['www.moadong.com', 'production'],
    ['localhost', 'development'],
    ['moadong-git-feature-x-moadongs-projects.vercel.app', 'preview'],
    ['moadong.com', 'preview'],
  ])('%s의 environment는 %s다', (hostname, environment) => {
    expect(getSentryEnvironment(hostname)).toBe(environment);
  });
});
