// 소개 페이지 대상 쿼리(?for=club)와 토글 상태 동기화를 검증하는 테스트
import { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { act, renderHook } from '@testing-library/react';
import useAudience from './useAudience';

const renderWithUrl = (url: string) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  );
  return renderHook(
    () => ({ ...useAudience(), search: useLocation().search }),
    { wrapper },
  );
};

describe('useAudience', () => {
  it('쿼리가 없으면 학생을 기본값으로 쓴다', () => {
    const { result } = renderWithUrl('/introduce');
    expect(result.current.audience).toBe('student');
  });

  it('?for=club이면 운영진을 연다', () => {
    const { result } = renderWithUrl('/introduce?for=club');
    expect(result.current.audience).toBe('club');
  });

  it('알 수 없는 값이면 학생으로 둔다', () => {
    const { result } = renderWithUrl('/introduce?for=admin');
    expect(result.current.audience).toBe('student');
  });

  it('운영진으로 바꾸면 쿼리를 붙이고, 학생으로 돌아오면 다른 쿼리는 남기고 for만 지운다', () => {
    const { result } = renderWithUrl('/introduce?ref=insta');

    act(() => result.current.changeAudience('club'));
    expect(result.current.audience).toBe('club');
    expect(result.current.search).toBe('?ref=insta&for=club');

    act(() => result.current.changeAudience('student'));
    expect(result.current.audience).toBe('student');
    expect(result.current.search).toBe('?ref=insta');
  });
});
