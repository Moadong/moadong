import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SwipeableEventRow from './SwipeableEventRow';
import { DELETE_WIDTH } from './SwipeableEventRow.styles';

// jsdom에는 포인터 캡처 구현이 없어 호출 여부만 확인할 수 있게 대체한다
const setPointerCapture = jest.fn();
beforeAll(() => {
  Element.prototype.setPointerCapture = setPointerCapture;
  Element.prototype.releasePointerCapture = jest.fn();
});

beforeEach(() => setPointerCapture.mockClear());

/**
 * jsdom에 PointerEvent가 없어 fireEvent.pointerDown은 pointerId·clientX를
 * 실어주지 못한다. MouseEvent로 만들고 pointerId만 얹는다.
 */
const pointerEvent = (type: string, clientX: number, pointerId = 1) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
  });
  Object.assign(event, { pointerId });
  return event;
};

const renderRow = () => {
  const onOpenChange = jest.fn();
  render(
    <SwipeableEventRow
      isOpen={false}
      onOpenChange={onOpenChange}
      onDelete={jest.fn()}
    >
      <span>정기모임</span>
    </SwipeableEventRow>,
  );
  return { row: screen.getByText('정기모임').parentElement!, onOpenChange };
};

describe('SwipeableEventRow', () => {
  it('드래그를 시작하면 포인터를 캡처한다', () => {
    const { row } = renderRow();

    fireEvent(row, pointerEvent('pointerdown', 200));

    expect(setPointerCapture).toHaveBeenCalledWith(1);
  });

  // 캡처가 없으면 포인터가 행을 벗어나는 순간 드래그가 끊겼다
  it('임계값을 넘겨 끌면 삭제 버튼을 연다', () => {
    const { row, onOpenChange } = renderRow();

    fireEvent(row, pointerEvent('pointerdown', 200));
    fireEvent(row, pointerEvent('pointermove', 200 - DELETE_WIDTH));
    fireEvent(row, pointerEvent('pointerup', 200 - DELETE_WIDTH));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('조금만 끌면 다시 닫는다', () => {
    const { row, onOpenChange } = renderRow();

    fireEvent(row, pointerEvent('pointerdown', 200));
    fireEvent(row, pointerEvent('pointermove', 195));
    fireEvent(row, pointerEvent('pointerup', 195));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
