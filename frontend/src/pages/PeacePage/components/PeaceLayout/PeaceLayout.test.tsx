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

const renderLayout = (kiosk = false) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <PeaceLayout kiosk={kiosk}>
          <p>본문</p>
        </PeaceLayout>
      </MemoryRouter>
    </ThemeProvider>,
  );

const setWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
};

describe('PeaceLayout', () => {
  it('데스크톱 폭에서는 Header와 Footer를 그린다', () => {
    setWidth(1024);
    renderLayout();
    expect(screen.getByText('HEADER')).toBeInTheDocument();
    expect(screen.getByText('FOOTER')).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
  });

  it('부스 모드에서는 헤더·탑바·푸터를 모두 숨긴다', () => {
    setWidth(1024);
    renderLayout(true);
    expect(screen.queryByText('HEADER')).not.toBeInTheDocument();
    expect(screen.queryByText('FOOTER')).not.toBeInTheDocument();
    expect(screen.queryByText(/TOPBAR/)).not.toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();
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
