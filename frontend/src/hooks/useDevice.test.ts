import { renderHook, act } from '@testing-library/react';
import useDevice from './useDevice';
import { BREAKPOINT } from '@/styles/mediaQuery';

describe('useDevice', () => {
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    act(() => { // Wrap the event dispatch in act
      window.dispatchEvent(new Event('resize'));
    });
  };

  beforeAll(() => {
    // Mock initial window width
    setWindowWidth(1024); // Default to a laptop size
  });

  it('should return correct device type for mobile width', () => {
    setWindowWidth(BREAKPOINT.mobile);
    const { result } = renderHook(() => useDevice());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should return correct device type for tablet width', () => {
    setWindowWidth(BREAKPOINT.mobile + 1); // Just above mobile
    const { result } = renderHook(() => useDevice());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);

    setWindowWidth(BREAKPOINT.tablet); // Max tablet
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should return correct device type for laptop width', () => {
    setWindowWidth(BREAKPOINT.tablet + 1); // Just above tablet
    const { result } = renderHook(() => useDevice());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isLaptop).toBe(true);
    expect(result.current.isDesktop).toBe(false);

    setWindowWidth(BREAKPOINT.laptop); // Max laptop
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isLaptop).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should return correct device type for desktop width', () => {
    setWindowWidth(BREAKPOINT.laptop + 1); // Just above laptop
    const { result } = renderHook(() => useDevice());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('should update device type on window resize', () => {
    const { result } = renderHook(() => useDevice());

    // Initially desktop (from beforeAll)
    expect(result.current.isDesktop).toBe(true);

    // Resize to mobile
    setWindowWidth(BREAKPOINT.mobile);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);

    // Resize to laptop
    setWindowWidth(BREAKPOINT.laptop);
    expect(result.current.isLaptop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });
});
