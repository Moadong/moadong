import '@testing-library/jest-dom';
import { act, render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import RecruitStats, { type RecruitStat } from './RecruitStats';

const STATS: RecruitStat[] = [
  { label: '메인 방문자', value: 12848, unit: '명', desc: '방문했어요' },
  {
    label: '지원하기 클릭',
    value: 18000,
    unit: '번',
    prefix: '약',
    desc: '눌렸어요',
  },
];

const mockMatchMedia = (reduceMotion: boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: reduceMotion && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
};

/** 화면에 들어왔다고 알려 줄 때까지 아무것도 하지 않는 IntersectionObserver */
let triggerIntersect: () => void = () => {};
const mockIntersectionObserver = () => {
  window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    triggerIntersect = () => callback([{ isIntersecting: true }]);
    return { observe: jest.fn(), disconnect: jest.fn() };
  }) as unknown as typeof IntersectionObserver;
};

const renderStats = () =>
  render(
    <ThemeProvider theme={theme}>
      <RecruitStats
        title='숫자로 보는 모아동'
        caption='최근 12개월'
        stats={STATS}
        closing='하단 문구'
      />
    </ThemeProvider>,
  );

/** 숫자 시각 요소(aria-hidden)에 보이는 글자 */
const visibleValue = (label: string) =>
  within(screen.getByText(label).closest('li')!)
    .getByTestId('stat-visual')
    .textContent?.replace(/\s/g, '');

describe('RecruitStats', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  it('스크린리더에는 카운트업과 상관없이 최종값을 읽힌다', () => {
    mockMatchMedia(false);
    renderStats();
    expect(screen.getByText('12,848명')).toBeInTheDocument();
    expect(screen.getByText('약 18,000번')).toBeInTheDocument();
  });

  it('화면에 들어오기 전에는 숫자가 0에서 시작한다', () => {
    mockMatchMedia(false);
    renderStats();
    expect(visibleValue('메인 방문자')).toBe('0명');
  });

  it('화면에 들어오면 1.2초 뒤 목표값에 도달한다', () => {
    jest.useFakeTimers();
    mockMatchMedia(false);
    renderStats();
    act(() => triggerIntersect());
    act(() => {
      jest.advanceTimersByTime(1300);
    });
    expect(visibleValue('메인 방문자')).toBe('12,848명');
    expect(visibleValue('지원하기 클릭')).toBe('약18,000번');
    jest.useRealTimers();
  });

  it('움직임 줄이기 설정이면 애니메이션 없이 최종값을 바로 보여 준다', () => {
    mockMatchMedia(true);
    renderStats();
    expect(visibleValue('메인 방문자')).toBe('12,848명');
  });
});
