import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LazyImage from './LazyImage';

// IntersectionObserver 모킹
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

// window.IntersectionObserver를 MockIntersectionObserver로 대체
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

describe('LazyImage 컴포넌트', () => {
  const defaultProps = {
    src: 'test-image.jpg',
    alt: '테스트 이미지',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('초기에는 이미지가 로드되지 않고 플레이스홀더가 표시되어야 함', () => {
    render(<LazyImage {...defaultProps} />);

    const placeholder = screen.getByTestId('lazy-image-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveStyle({ backgroundColor: '#f0f0f0' });

    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  /**
   * @test 컴포넌트가 mount될 때 IntersectionObserver가 요소를 관찰해야 한다.
   */
  it('IntersectionObserver가 요소를 관찰해야 함', () => {
    render(<LazyImage {...defaultProps} />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it('요소가 화면에 보일 때 이미지를 로드해야 함', async () => {
    render(<LazyImage {...defaultProps} />);

    const [[callback]] = mockIntersectionObserver.mock.calls;
    const entry = { isIntersecting: true };
    act(() => {
      callback([entry], {} as IntersectionObserver);
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'test-image.jpg');
      expect(img).toHaveAttribute('alt', '테스트 이미지');
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('index prop에 따라 지연 시간이 적용되어야 함', () => {
    render(<LazyImage {...defaultProps} index={2} delayMs={100} />);

    const [[callback]] = mockIntersectionObserver.mock.calls;
    const entry = { isIntersecting: true };
    act(() => {
      callback([entry], {} as IntersectionObserver);
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('onError prop이 호출되어야 함', async () => {
    const onError = jest.fn();
    render(<LazyImage {...defaultProps} onError={onError} />);

    const [[callback]] = mockIntersectionObserver.mock.calls;
    const entry = { isIntersecting: true };
    act(() => {
      callback([entry], {} as IntersectionObserver);
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const img = screen.getByRole('img');
    act(() => {
      img.dispatchEvent(new Event('error'));
    });

    expect(onError).toHaveBeenCalled();
  });

  it('컴포넌트가 언마운트될 때 IntersectionObserver가 해제되어야 함', () => {
    const { unmount } = render(<LazyImage {...defaultProps} />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
