import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import useBodyScrollLock from './useBodyScrollLock';

const Locker = ({ isLocked }: { isLocked: boolean }) => {
  useBodyScrollLock(isLocked);
  return null;
};

beforeEach(() => {
  window.scrollTo = jest.fn();
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
});

const isLocked = () => document.body.style.position === 'fixed';

describe('useBodyScrollLock', () => {
  it('열리면 잠그고 닫히면 되돌린다', () => {
    const { rerender } = render(<Locker isLocked />);
    expect(isLocked()).toBe(true);

    rerender(<Locker isLocked={false} />);
    expect(isLocked()).toBe(false);
  });

  // 모달 안에서 시트를 여는 경우. 안쪽이 닫혀도 바깥이 열려 있으면 잠금이 유지돼야 한다
  it('겹쳐 열렸다가 안쪽만 닫히면 잠금을 유지한다', () => {
    const Nested = ({ inner }: { inner: boolean }) => (
      <>
        <Locker isLocked />
        {inner && <Locker isLocked />}
      </>
    );

    const { rerender } = render(<Nested inner />);
    expect(isLocked()).toBe(true);

    rerender(<Nested inner={false} />);
    expect(isLocked()).toBe(true);

    rerender(<></>);
    expect(isLocked()).toBe(false);
  });

  it('마지막 해제에서 원래 스크롤 위치로 되돌린다', () => {
    Object.defineProperty(window, 'scrollY', { value: 320, writable: true });

    const { rerender } = render(<Locker isLocked />);
    expect(document.body.style.top).toBe('-320px');

    rerender(<Locker isLocked={false} />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 320);
  });
});
