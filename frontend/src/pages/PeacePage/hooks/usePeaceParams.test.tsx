import { MemoryRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { usePeaceParams } from './usePeaceParams';

const render = (search: string) =>
  renderHook(() => usePeaceParams(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[`/peace${search}`]}>
        {children}
      </MemoryRouter>
    ),
  });

describe('usePeaceParams', () => {
  it('kiosk=1이면 부스 모드다', () => {
    expect(render('?kiosk=1').result.current.isKiosk).toBe(true);
    expect(render('').result.current.isKiosk).toBe(false);
  });

  it('src를 읽고 없으면 undefined다', () => {
    expect(render('?src=booth').result.current.src).toBe('booth');
    expect(render('').result.current.src).toBeUndefined();
  });

  it('정의되지 않은 src는 버리고 다음 경로에도 싣지 않는다', () => {
    const { src, withParams } = render('?src=anything&kiosk=1').result.current;
    expect(src).toBeUndefined();
    expect(withParams('/peace/quiz')).toBe('/peace/quiz?kiosk=1');
  });

  it('withParams는 kiosk·src를 다음 경로에 이어 붙인다', () => {
    const { withParams } = render('?kiosk=1&src=booth').result.current;
    expect(withParams('/peace/quiz')).toBe('/peace/quiz?kiosk=1&src=booth');
    expect(withParams('/peace/result?type=carer')).toBe(
      '/peace/result?type=carer&kiosk=1&src=booth',
    );
  });

  it('withParams는 파라미터가 없으면 경로를 그대로 둔다', () => {
    const { withParams } = render('').result.current;
    expect(withParams('/peace/quiz')).toBe('/peace/quiz');
  });
});
