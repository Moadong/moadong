import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { fireEvent, render } from '@testing-library/react';
import useTopmostEscape from './useTopmostEscape';

const Overlay = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}) => {
  useTopmostEscape(isOpen, onClose);
  return <>{children}</>;
};

const pressEscape = () =>
  fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

describe('useTopmostEscape', () => {
  it('ESC로 열린 오버레이를 닫는다', () => {
    const onClose = jest.fn();
    render(<Overlay isOpen onClose={onClose} />);

    pressEscape();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('한글 조합 중 ESC는 조합 취소일 뿐이라 닫지 않는다', () => {
    const onClose = jest.fn();
    render(<Overlay isOpen onClose={onClose} />);

    fireEvent.keyDown(document, {
      key: 'Escape',
      code: 'Escape',
      isComposing: true,
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('닫힌 오버레이는 ESC에 반응하지 않는다', () => {
    const onClose = jest.fn();
    render(<Overlay isOpen={false} onClose={onClose} />);

    pressEscape();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('겹쳐 열리면 가장 위 하나만 닫는다', () => {
    const closeOuter = jest.fn();
    const closeInner = jest.fn();

    const Nested = ({ inner }: { inner: boolean }) => (
      <>
        <Overlay isOpen onClose={closeOuter} />
        {inner && <Overlay isOpen onClose={closeInner} />}
      </>
    );

    const { rerender } = render(<Nested inner />);

    pressEscape();
    expect(closeInner).toHaveBeenCalledTimes(1);
    expect(closeOuter).not.toHaveBeenCalled();

    rerender(<Nested inner={false} />);
    pressEscape();
    expect(closeOuter).toHaveBeenCalledTimes(1);
    expect(closeInner).toHaveBeenCalledTimes(1);
  });

  it('아래쪽 오버레이가 먼저 닫혀도 위쪽은 그대로 남는다', () => {
    const closeOuter = jest.fn();
    const closeInner = jest.fn();

    const Nested = ({ outer }: { outer: boolean }) => (
      <>
        {outer && <Overlay isOpen onClose={closeOuter} />}
        <Overlay isOpen onClose={closeInner} />
      </>
    );

    const { rerender } = render(<Nested outer />);
    rerender(<Nested outer={false} />);

    pressEscape();
    expect(closeInner).toHaveBeenCalledTimes(1);
    expect(closeOuter).not.toHaveBeenCalled();
  });

  /**
   * 알려진 한계를 고정해 둔 테스트다.
   *
   * 스택 순서는 시각적 위아래가 아니라 effect 실행 순서인데, React는 자식
   * effect를 부모보다 먼저 돌린다. 그래서 부모와 자식이 같은 커밋에 함께
   * 열리면 스택이 [자식, 부모]가 되어 ESC가 아래쪽인 부모를 닫는다.
   *
   * Portal이 오버레이를 모두 #modal-root의 형제로 넣기 때문에 DOM 계층으로는
   * 바로잡을 수 없다. 중첩을 표현하려면 React Context로 깊이를 내려야 한다.
   *
   * 실제 사용처(Modal은 닫혔을 때 null을 반환한다)에서는 자식이 부모보다
   * 늦게 마운트되어 이 경우가 나오지 않는다. 순서를 바로잡는 수정을 하게
   * 되면 이 테스트를 기대값과 함께 뒤집을 것.
   */
  it('부모-자식이 같은 커밋에 열리면 부모가 먼저 닫힌다', () => {
    const closeParent = jest.fn();
    const closeChild = jest.fn();

    render(
      <Overlay isOpen onClose={closeParent}>
        <Overlay isOpen onClose={closeChild} />
      </Overlay>,
    );

    pressEscape();
    expect(closeParent).toHaveBeenCalledTimes(1);
    expect(closeChild).not.toHaveBeenCalled();
  });
});
