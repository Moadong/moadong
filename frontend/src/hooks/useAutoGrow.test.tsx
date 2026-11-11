import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import useAutoGrow from './useAutoGrow';

type Callback = (entries: { contentRect: { width: number } }[]) => void;

let callback: Callback;
const observe = jest.fn();
const disconnect = jest.fn();

class MockResizeObserver {
  constructor(cb: Callback) {
    callback = cb;
  }
  observe = observe;
  disconnect = disconnect;
}

const AutoGrowTextArea = ({ value }: { value: string }) => {
  const ref = useAutoGrow(value);
  return <textarea ref={ref} value={value} readOnly aria-label='입력' />;
};

const resize = (width: number) => callback([{ contentRect: { width } }]);

describe('useAutoGrow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: MockResizeObserver,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'ResizeObserver');
  });

  const setup = () => {
    const utils = render(<AutoGrowTextArea value='긴 글' />);
    const textarea = utils.getByLabelText('입력') as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 59,
    });
    return { ...utils, textarea };
  };

  it('observe 직후 첫 알림은 너비만 기억하고 높이를 다시 쓰지 않는다', () => {
    const { textarea } = setup();
    textarea.style.height = '20px';

    resize(300);

    expect(textarea.style.height).toBe('20px');
  });

  it('너비가 그대로면(높이 조정으로 생긴 알림) 높이를 다시 쓰지 않는다', () => {
    const { textarea } = setup();
    resize(300); // observe 직후 첫 알림: 너비만 기억한다
    textarea.style.height = '20px';

    resize(300);

    expect(textarea.style.height).toBe('20px');
  });

  it('너비가 바뀌면 scrollHeight로 높이를 다시 맞춘다', () => {
    const { textarea } = setup();
    resize(300);

    resize(299.5);

    expect(textarea.style.height).toBe('59px');
  });

  it('언마운트하면 observer를 끊는다', () => {
    const { unmount } = setup();
    expect(observe).toHaveBeenCalledTimes(1);

    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
