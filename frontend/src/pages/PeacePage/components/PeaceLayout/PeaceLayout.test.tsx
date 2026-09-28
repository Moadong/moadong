import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import PeaceLayout from './PeaceLayout';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('@/components/common/Header/Header', () => ({
  __esModule: true,
  default: () => <div>HEADER</div>,
}));
jest.mock('@/components/common/Footer/Footer', () => ({
  __esModule: true,
  default: () => <div>FOOTER</div>,
}));
jest.mock('@/components/common/WebviewTopBar/WebviewTopBar', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>TOPBAR {title}</div>,
}));

const renderLayout = (tone?: 'green') =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <PeaceLayout tone={tone}>
          <p>본문</p>
        </PeaceLayout>
      </MemoryRouter>
    </ThemeProvider>,
  );

const setWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
};

describe('PeaceLayout', () => {
  it('데스크톱 폭에서는 Header를 그리고 Footer는 두지 않는다(몰입 유지)', () => {
    setWidth(1024);
    renderLayout();
    expect(screen.getByText('HEADER')).toBeInTheDocument();
    expect(screen.queryByText('FOOTER')).not.toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
  });

  it('green 톤이면 본문 칼럼에만 그라데이션을, 바깥에는 단색을 깐다', () => {
    setWidth(1280);
    renderLayout('green');
    const main = screen.getByRole('main');
    const css = document.head.textContent ?? '';
    const mainRule = [...main.classList]
      .map((cls) => css.match(new RegExp(`\\.${cls}\\{[^}]*\\}`))?.[0])
      .find((r) => r?.includes('linear-gradient'));
    expect(mainRule).toBeDefined();
    const wrapper = main.parentElement as HTMLElement;
    const wrapperRule = [...wrapper.classList]
      .map((cls) => css.match(new RegExp(`\\.${cls}\\{[^}]*\\}`))?.[0])
      .find((r) => r?.includes('#E6F4EC'));
    expect(wrapperRule).toBeDefined();
  });

  it('모바일 폭에서는 WebviewTopBar를 그린다', () => {
    setWidth(390);
    renderLayout();
    expect(
      screen.getByText('TOPBAR 나와 맞는 평화 활동 찾기'),
    ).toBeInTheDocument();
    expect(screen.queryByText('HEADER')).not.toBeInTheDocument();
  });
});
