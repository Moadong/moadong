import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import WebviewTopBar from './WebviewTopBar';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));

const mockRequestNavigateBack = jest.fn();
jest.mock('@/utils/webviewBridge', () => ({
  requestNavigateBack: () => mockRequestNavigateBack(),
}));

/** 이전 화면이 있는지는 브라우저 history의 idx로 판단하므로 테스트마다 직접 맞춘다 */
const setHistoryIdx = (idx: number) => {
  window.history.replaceState({ idx }, '');
};

const renderTopBar = (fallbackPath?: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/prev', '/current']} initialIndex={1}>
        <Routes>
          <Route path='/' element={<div>HOME</div>} />
          <Route path='/prev' element={<div>PREV</div>} />
          <Route path='/recruit' element={<div>RECRUIT LIST</div>} />
          <Route
            path='/current'
            element={<WebviewTopBar title='제목' fallbackPath={fallbackPath} />}
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

const clickBack = () =>
  userEvent.click(screen.getByRole('button', { name: '뒤로가기' }));

describe('WebviewTopBar', () => {
  beforeEach(() => {
    mockRequestNavigateBack.mockReset();
    mockRequestNavigateBack.mockReturnValue(false);
    setHistoryIdx(0);
  });

  it('앱이 뒤로가기를 처리하면 웹에서는 이동하지 않는다', async () => {
    mockRequestNavigateBack.mockReturnValue(true);
    renderTopBar('/recruit');
    await clickBack();
    expect(mockRequestNavigateBack).toHaveBeenCalled();
    expect(screen.queryByText('RECRUIT LIST')).not.toBeInTheDocument();
    expect(screen.queryByText('PREV')).not.toBeInTheDocument();
  });

  it('이전 화면이 있으면 이전 화면으로 돌아간다', async () => {
    setHistoryIdx(1);
    renderTopBar('/recruit');
    await clickBack();
    expect(screen.getByText('PREV')).toBeInTheDocument();
  });

  it('이전 화면이 없으면 fallbackPath로 보낸다', async () => {
    renderTopBar('/recruit');
    await clickBack();
    expect(screen.getByText('RECRUIT LIST')).toBeInTheDocument();
  });

  it('fallbackPath가 없으면 홈으로 보낸다', async () => {
    renderTopBar();
    await clickBack();
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });
});
