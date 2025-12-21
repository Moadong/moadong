import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LazyImage from './LazyImage';

const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();

/**
 * MockIntersectionObserver
 * - IntersectionObserver를 테스트용으로 모킹한 클래스입니다.
 * - callback 저장, 관찰 시작(observe), 관찰 중지(disconnect) 메서드를 제공합니다.
 */
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    mockIntersectionObserver(callback);
  }
  disconnect = mockDisconnect;
  observe = mockObserve;
}

/**
 * window.IntersectionObserver를 MockIntersectionObserver로 대체
 */
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

describe('LazyImage 컴포넌트 테스트', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    alt: '테스트 이미지',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기에는 이미지가 로드되지 않아야 한다', () => {
    render(<LazyImage {...defaultProps} />);

    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  /**
   * @test 컴포넌트가 mount될 때 IntersectionObserver가 요소를 관찰해야 한다.
   */
  it('IntersectionObserver가 요소를 관찰해야 한다', () => {
    render(<LazyImage {...defaultProps} />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it('요소가 화면에 보일 때 이미지를 로드해야 한다', async () => {
    render(<LazyImage {...defaultProps} />);

    const [[callback]] = mockIntersectionObserver.mock.calls;
    const entry = { isIntersecting: true };

    act(() => {
      callback([entry], {} as IntersectionObserver);
    });

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'test-image.jpg');
      expect(img).toHaveAttribute('alt', '테스트 이미지');
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('onError prop이 호출되어야 한다', async () => {
    const onError = jest.fn();
    render(<LazyImage {...defaultProps} onError={onError} />);

    const [[callback]] = mockIntersectionObserver.mock.calls;
    const entry = { isIntersecting: true };

    act(() => {
      callback([entry], {} as IntersectionObserver);
    });

    const img = await screen.findByRole('img');

    act(() => {
      img.dispatchEvent(new Event('error'));
    });

    expect(onError).toHaveBeenCalled();
  });

  it('컴포넌트가 언마운트될 때 IntersectionObserver가 해제되어야 한다', () => {
    const { unmount } = render(<LazyImage {...defaultProps} />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
