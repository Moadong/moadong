import '@testing-library/jest-dom';
import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useFocusTrap from './useFocusTrap';

const Overlay = ({ isOpen, name }: { isOpen: boolean; name: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, ref);

  if (!isOpen) return null;

  return (
    <div ref={ref} tabIndex={-1} data-testid={name}>
      <button>{name} 첫</button>
      <button>{name} 끝</button>
    </div>
  );
};

/** preventDefault로 브라우저 기본 이동을 막았으면 false를 돌려준다 */
const pressTab = (shiftKey = false) =>
  fireEvent.keyDown(document, { key: 'Tab', shiftKey });

describe('useFocusTrap', () => {
  it('열리면 컨테이너로 포커스가 들어간다', () => {
    render(<Overlay isOpen name='모달' />);

    expect(screen.getByTestId('모달')).toHaveFocus();
  });

  it('안쪽 요소의 onFocus를 건드리지 않는다', () => {
    const onFocus = jest.fn();
    const Sneaky = () => {
      const ref = useRef<HTMLDivElement>(null);
      useFocusTrap(true, ref);
      return (
        <div ref={ref} tabIndex={-1}>
          <button onFocus={onFocus}>부수효과</button>
        </div>
      );
    };
    render(<Sneaky />);

    expect(onFocus).not.toHaveBeenCalled();
  });

  it('마지막 요소에서 Tab을 누르면 첫 요소로 돌아온다', () => {
    render(<Overlay isOpen name='모달' />);
    screen.getByRole('button', { name: '모달 끝' }).focus();

    expect(pressTab()).toBe(false);
    expect(screen.getByRole('button', { name: '모달 첫' })).toHaveFocus();
  });

  it('첫 요소에서 Shift+Tab을 누르면 마지막 요소로 간다', () => {
    render(<Overlay isOpen name='모달' />);
    screen.getByRole('button', { name: '모달 첫' }).focus();

    expect(pressTab(true)).toBe(false);
    expect(screen.getByRole('button', { name: '모달 끝' })).toHaveFocus();
  });

  it('열자마자 Shift+Tab을 눌러도 배경으로 나가지 않는다', () => {
    render(<Overlay isOpen name='모달' />);

    expect(pressTab(true)).toBe(false);
    expect(screen.getByRole('button', { name: '모달 끝' })).toHaveFocus();
  });

  it('배경으로 빠져나간 포커스를 다시 안으로 데려온다', () => {
    render(<Overlay isOpen name='모달' />);
    (document.activeElement as HTMLElement).blur();
    expect(document.body).toHaveFocus();

    pressTab();
    expect(screen.getByRole('button', { name: '모달 첫' })).toHaveFocus();
  });

  it('닫히면 열기 전 포커스로 복원한다', () => {
    const Scene = ({ isOpen }: { isOpen: boolean }) => (
      <>
        <button>배경</button>
        <Overlay isOpen={isOpen} name='모달' />
      </>
    );

    const { rerender } = render(<Scene isOpen={false} />);
    const background = screen.getByRole('button', { name: '배경' });
    background.focus();

    rerender(<Scene isOpen />);
    expect(screen.getByTestId('모달')).toHaveFocus();

    rerender(<Scene isOpen={false} />);
    expect(background).toHaveFocus();
  });

  it('겹쳐 열리면 가장 위 하나만 가둔다', () => {
    const Nested = ({ inner }: { inner: boolean }) => (
      <>
        <Overlay isOpen name='바깥' />
        {inner && <Overlay isOpen name='안쪽' />}
      </>
    );

    const { rerender } = render(<Nested inner />);
    expect(screen.getByTestId('안쪽')).toHaveFocus();

    // 바깥이 아니라 안쪽 요소끼리 순환한다
    screen.getByRole('button', { name: '안쪽 끝' }).focus();
    pressTab();
    expect(screen.getByRole('button', { name: '안쪽 첫' })).toHaveFocus();

    rerender(<Nested inner={false} />);
    expect(screen.getByTestId('바깥')).toHaveFocus();
  });
});

describe('useFocusTrap 숨겨진 요소', () => {
  const proto = HTMLElement.prototype as {
    checkVisibility?: (
      this: HTMLElement,
      options?: { visibilityProperty?: boolean },
    ) => boolean;
  };

  /**
   * jsdom엔 checkVisibility가 없어 인라인 스타일만 보는 흉내를 붙인다.
   *
   * visibility는 실제 API와 같이 visibilityProperty를 켰을 때만 본다.
   * 호출부에서 옵션을 빠뜨리면 '가려진' 요소가 걸러지지 않아 테스트가 깨진다.
   */
  beforeEach(() => {
    proto.checkVisibility = function (
      this: HTMLElement,
      options?: { visibilityProperty?: boolean },
    ) {
      if (this.style.display === 'none') return false;
      if (options?.visibilityProperty && this.style.visibility === 'hidden') {
        return false;
      }
      return true;
    };
  });
  afterEach(() => {
    delete proto.checkVisibility;
  });

  const Edges = () => {
    const ref = useRef<HTMLDivElement>(null);
    useFocusTrap(true, ref);
    return (
      <div ref={ref} tabIndex={-1}>
        <button style={{ display: 'none' }}>숨긴 첫</button>
        <button style={{ visibility: 'hidden' }}>가려진 첫</button>
        <button>첫</button>
        <button>끝</button>
        <button style={{ visibility: 'hidden' }}>가려진 끝</button>
        <button style={{ display: 'none' }}>숨긴 끝</button>
      </div>
    );
  };

  it('끝자리가 숨겨져 있으면 보이는 마지막 요소에서 첫 요소로 돌아온다', () => {
    render(<Edges />);
    screen.getByRole('button', { name: '끝' }).focus();

    expect(pressTab()).toBe(false);
    expect(screen.getByRole('button', { name: '첫' })).toHaveFocus();
  });

  it('첫자리가 숨겨져 있으면 보이는 첫 요소에서 마지막 요소로 간다', () => {
    render(<Edges />);
    screen.getByRole('button', { name: '첫' }).focus();

    expect(pressTab(true)).toBe(false);
    expect(screen.getByRole('button', { name: '끝' })).toHaveFocus();
  });
});
