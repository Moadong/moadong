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
  // 상단바 대신, 페이지가 넘긴 onBack이 있을 때만 버튼으로 드러낸다
  default: ({
    children,
    onBack,
  }: {
    children: React.ReactNode;
    onBack?: () => void;
  }) => (
    <div>
      {onBack && (
        <button type='button' onClick={onBack}>
          상단바 뒤로가기
        </button>
      )}
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

const renderPage = (position: string, previousPath?: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter
        initialEntries={[
          ...(previousPath ? [previousPath] : []),
          `/recruit/${position}`,
        ]}
        initialIndex={previousPath ? 1 : 0}
      >
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
    await userEvent.click(screen.getByRole('link', { name: '지원하기' }));
    expect(screen.getByText('APPLICATION club-1/form-dev')).toBeInTheDocument();
  });

  it('상세 주소로 바로 들어오면 상단바 뒤로가기가 모집 목록으로 보낸다', async () => {
    renderPage('designer');
    await userEvent.click(
      screen.getByRole('button', { name: '상단바 뒤로가기' }),
    );
    expect(screen.getByText('RECRUIT LIST')).toBeInTheDocument();
  });

  it('이전 화면이 있으면 상단바 기본 뒤로가기를 그대로 쓴다', () => {
    renderPage('designer', '/recruit');
    expect(
      screen.queryByRole('button', { name: '상단바 뒤로가기' }),
    ).not.toBeInTheDocument();
  });
});
