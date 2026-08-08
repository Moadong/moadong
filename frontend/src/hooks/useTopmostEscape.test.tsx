import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import useTopmostEscape from './useTopmostEscape';

const Overlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  useTopmostEscape(isOpen, onClose);
  return null;
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

  it('닫힌 오버레이는 ESC에 반응하지 않는다', () => {
    const onClose = jest.fn();
    render(<Overlay isOpen={false} onClose={onClose} />);

    pressEscape();
    expect(onClose).not.toHaveBeenCalled();
  });

  // 모달 안에서 시트를 여는 경우. ESC 한 번에 둘 다 닫히면 안 된다
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

    // 안쪽이 닫히면 그다음 ESC는 바깥으로 간다
    rerender(<Nested inner={false} />);
    pressEscape();
    expect(closeOuter).toHaveBeenCalledTimes(1);
    expect(closeInner).toHaveBeenCalledTimes(1);
  });
});
