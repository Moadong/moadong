import { act, fireEvent, render, screen } from '@testing-library/react';
import { Reorder } from 'framer-motion';
import LongPressReorderItem from './LongPressReorderItem';

// jsdom에는 PointerEvent가 없어 MouseEvent로 대신한다
if (typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}

const renderItem = () => {
  render(
    <Reorder.Group axis='y' values={['a']} onReorder={() => {}}>
      <LongPressReorderItem value='a'>
        <textarea aria-label='질문 제목' />
        <button type='button'>삭제</button>
      </LongPressReorderItem>
    </Reorder.Group>,
  );
  const textarea = screen.getByLabelText('질문 제목');
  // 드래그 중에는 안쪽 내용이 포인터를 받지 않는다
  const content = textarea.parentElement!;
  return { textarea, content, button: screen.getByRole('button') };
};

const press = (el: Element) =>
  fireEvent.pointerDown(el, { button: 0, clientX: 10, clientY: 10 });

describe('LongPressReorderItem', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('입력 위에서 길게 누르기 전에 떼면 드래그하지 않고 포커스를 유지한다', () => {
    const { textarea, content } = renderItem();
    textarea.focus();

    press(textarea);
    act(() => jest.advanceTimersByTime(150));
    fireEvent.pointerUp(window);
    act(() => jest.advanceTimersByTime(500));

    expect(document.activeElement).toBe(textarea);
    expect(content.style.pointerEvents).toBe('');
  });

  it('입력 위에서 길게 누르면 포커스를 풀고 드래그를 시작한다', () => {
    const { textarea, content } = renderItem();
    textarea.focus();

    press(textarea);
    act(() => jest.advanceTimersByTime(200));

    expect(document.activeElement).not.toBe(textarea);
    expect(content.style.pointerEvents).toBe('none');
  });

  it('누른 채 8px 넘게 움직이면 스크롤로 보고 드래그하지 않는다', () => {
    const { textarea, content } = renderItem();

    press(textarea);
    fireEvent.pointerMove(window, { clientX: 10, clientY: 30 });
    act(() => jest.advanceTimersByTime(500));

    expect(content.style.pointerEvents).toBe('');
  });

  it('버튼 위에서는 길게 눌러도 드래그하지 않는다', () => {
    const { button, content } = renderItem();
    button.focus();

    press(button);
    act(() => jest.advanceTimersByTime(500));

    expect(document.activeElement).toBe(button);
    expect(content.style.pointerEvents).toBe('');
  });

  it('길게 누른 뒤 움직이지 않고 떼면 드래그 상태를 끝낸다', () => {
    const { textarea, content } = renderItem();

    press(textarea);
    act(() => jest.advanceTimersByTime(200));
    expect(content.style.pointerEvents).toBe('none');

    act(() => {
      fireEvent.pointerUp(window);
    });

    expect(content.style.pointerEvents).toBe('');
  });
});
