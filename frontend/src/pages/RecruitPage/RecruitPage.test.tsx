import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import RecruitPage from './RecruitPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/RecruitLayout/RecruitLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const PositionProbe = () => {
  const { position } = useParams();
  return <div>POSITION {position}</div>;
};

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/recruit']}>
        <Routes>
          <Route path='/recruit' element={<RecruitPage />} />
          <Route path='/recruit/:position' element={<PositionProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('RecruitPage', () => {
  it('디자이너와 개발자 포지션 카드를 그린다', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /디자이너/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /개발자/ })).toBeInTheDocument();
  });

  it('포지션 카드를 누르면 해당 포지션 상세로 이동한다', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('link', { name: /디자이너/ }));
    expect(screen.getByText('POSITION designer')).toBeInTheDocument();
  });
});
