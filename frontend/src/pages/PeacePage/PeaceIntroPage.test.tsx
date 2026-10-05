import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import PeaceIntroPage from './PeaceIntroPage';

const mockTrack = jest.fn();
jest.mock('mixpanel-browser', () => ({
  track: (...args: unknown[]) => mockTrack(...args),
}));
jest.mock('./components/PeaceLayout/PeaceLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PEACE_PAGE_TITLE: '나와 맞는 평화 활동 찾기',
}));

const QuizProbe = () => {
  const { search } = useLocation();
  return <div>QUIZ {search}</div>;
};

const renderIntro = (search = '') =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/peace${search}`]}>
        <Routes>
          <Route path='/peace' element={<PeaceIntroPage />} />
          <Route path='/peace/quiz' element={<QuizProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('PeaceIntroPage', () => {
  it('제목과 시작하기 버튼을 그린다', () => {
    renderIntro();
    expect(screen.getByText('나와 맞는 평화 활동 찾기')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '시작하기' }),
    ).toBeInTheDocument();
  });

  it('시작하기를 누르면 /peace/quiz로 이동한다', async () => {
    renderIntro();
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }));
    expect(screen.getByText('QUIZ')).toBeInTheDocument();
    expect(mockTrack).toHaveBeenCalledWith(
      'Quiz Started',
      expect.objectContaining({ festival: 'un_peace_2026' }),
    );
  });

  it('부스 모드와 유입 경로 파라미터를 퀴즈로 이어 넘긴다', async () => {
    renderIntro('?kiosk=1&src=booth');
    await userEvent.click(screen.getByRole('button', { name: '시작하기' }));
    expect(screen.getByText('QUIZ ?kiosk=1&src=booth')).toBeInTheDocument();
  });
});
