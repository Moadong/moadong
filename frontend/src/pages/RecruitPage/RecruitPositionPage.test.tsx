import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import type * as RecruitConstants from './constants/recruit';
import RecruitPositionPage from './RecruitPositionPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/RecruitLayout/RecruitLayout', () => ({
  __esModule: true,
  // 상단바 대신, 페이지가 넘긴 뒤로가기 대체 경로를 글자로 드러낸다
  default: ({
    children,
    backFallbackPath,
  }: {
    children: React.ReactNode;
    backFallbackPath?: string;
  }) => (
    <div>
      <span>BACK FALLBACK {backFallbackPath}</span>
      {children}
    </div>
  ),
}));
jest.mock('./constants/recruit', () => ({
  ...jest.requireActual('./constants/recruit'),
}));

type Recruit = typeof RecruitConstants;
const actualRecruit = jest.requireActual<Recruit>('./constants/recruit');
const mockedRecruit = jest.requireMock<{
  -readonly [K in keyof Recruit]: Recruit[K];
}>('./constants/recruit');

/** 페이지는 렌더할 때 모듈 값을 읽으므로 목 모듈의 값을 바꿔 id 유무를 흉내 낸다 */
const setRecruitIds = (
  clubId: string,
  formIds: Partial<Record<RecruitConstants.RecruitPositionId, string>> = {},
) => {
  mockedRecruit.MOADONG_CLUB_ID = clubId;
  mockedRecruit.RECRUIT_POSITIONS = actualRecruit.RECRUIT_POSITIONS.map(
    (position) => ({
      ...position,
      applicationFormId: formIds[position.id] ?? '',
    }),
  );
};

const ApplicationProbe = () => {
  const { clubId, applicationFormId } = useParams();
  return (
    <div>
      APPLICATION {clubId}/{applicationFormId}
    </div>
  );
};

const renderPage = (position: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/recruit/${position}`]}>
        <Routes>
          <Route path='/recruit' element={<div>RECRUIT LIST</div>} />
          <Route path='/recruit/:position' element={<RecruitPositionPage />} />
          <Route
            path='/application/:clubId/:applicationFormId'
            element={<ApplicationProbe />}
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('RecruitPositionPage', () => {
  beforeEach(() => {
    setRecruitIds('');
  });

  it('포지션의 자격요건과 우대사항을 그린다', () => {
    renderPage('designer');
    expect(
      screen.getByRole('heading', { name: '디자이너' }),
    ).toBeInTheDocument();
    expect(screen.getByText('자격요건')).toBeInTheDocument();
    expect(screen.getByText('우대사항')).toBeInTheDocument();
  });

  it('없는 포지션이면 모집 목록으로 보낸다', () => {
    renderPage('marketer');
    expect(screen.getByText('RECRUIT LIST')).toBeInTheDocument();
  });

  it('지원서 id가 없으면 지원 버튼을 막는다', () => {
    setRecruitIds('club-1');
    renderPage('designer');
    expect(screen.getByRole('button', { name: /준비 중/ })).toBeDisabled();
  });

  it('동아리 id가 없으면 지원 버튼을 막는다', () => {
    setRecruitIds('', { designer: 'form-1' });
    renderPage('designer');
    expect(screen.getByRole('button', { name: /준비 중/ })).toBeDisabled();
  });

  it('id가 모두 있으면 해당 포지션의 지원서로 이동한다', async () => {
    setRecruitIds('club-1', { developer: 'form-dev' });
    renderPage('developer');
    await userEvent.click(screen.getByRole('button', { name: '지원하기' }));
    expect(screen.getByText('APPLICATION club-1/form-dev')).toBeInTheDocument();
  });

  it('상단바 뒤로가기가 갈 곳이 없으면 모집 목록으로 보내도록 경로를 넘긴다', () => {
    renderPage('designer');
    expect(screen.getByText('BACK FALLBACK /recruit')).toBeInTheDocument();
  });
});
