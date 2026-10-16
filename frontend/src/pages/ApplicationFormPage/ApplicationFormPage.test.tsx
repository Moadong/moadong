import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { applyToClub } from '@/apis/application';
import { MOADONG_CLUB_ID } from '@/constants/moadongClub';
import { useGetApplication } from '@/hooks/Queries/useApplication';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { theme } from '@/styles/theme';
import ApplicationFormPage from './ApplicationFormPage';

jest.mock('@/apis/application', () => ({ applyToClub: jest.fn() }));
jest.mock('@/hooks/Queries/useClub', () => ({ useGetClubDetail: jest.fn() }));
jest.mock('@/hooks/Queries/useApplication', () => ({
  useGetApplication: jest.fn(),
}));
jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));
jest.mock('@/hooks/Mixpanel/useTrackPageView', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/components/common/Header/Header', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/components/common/Footer/Footer', () => ({
  __esModule: true,
  default: () => null,
}));

const FORM_ID = 'form-id';
const OTHER_CLUB_ID = 'other-club-id';

// react-router는 `@:param`을 리터럴로 보므로 `@이름` 전체를 :clubId로 받는다
const ClubDetailProbe = () => {
  const { clubId } = useParams();
  return <div>CLUB DETAIL {clubId}</div>;
};

const setup = (
  clubId: string,
  clubName: string,
  { loadFails = false } = {},
) => {
  jest.mocked(useGetClubDetail).mockReturnValue({
    data: { id: clubId, name: clubName },
    error: null,
  } as unknown as ReturnType<typeof useGetClubDetail>);
  jest.mocked(useGetApplication).mockReturnValue({
    data: loadFails ? undefined : { title: '지원서', questions: [] },
    isLoading: false,
    isError: loadFails,
    error: loadFails ? new Error('지원서를 불러오지 못했어요') : null,
  } as unknown as ReturnType<typeof useGetApplication>);

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/application/${clubId}/${FORM_ID}`]}>
        <Routes>
          <Route
            path='/application/:clubId/:applicationFormId'
            element={<ApplicationFormPage />}
          />
          <Route path='/recruit' element={<div>RECRUIT PAGE</div>} />
          <Route path='/clubDetail/:clubId' element={<ClubDetailProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe('ApplicationFormPage 이동 경로', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.mocked(applyToClub).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('모아동 지원서는 제출하면 팀원 모집 페이지로 돌아간다', async () => {
    setup(MOADONG_CLUB_ID, '모아동');

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    expect(applyToClub).toHaveBeenCalledWith(MOADONG_CLUB_ID, FORM_ID, []);
    expect(await screen.findByText('RECRUIT PAGE')).toBeInTheDocument();
  });

  it('다른 동아리 지원서는 제출하면 그 동아리 상세로 간다', async () => {
    setup(OTHER_CLUB_ID, '테스트 동아리');

    await userEvent.click(screen.getByRole('button', { name: '제출하기' }));

    expect(
      await screen.findByText('CLUB DETAIL @테스트 동아리'),
    ).toBeInTheDocument();
  });

  it('모아동 지원서를 불러오지 못하면 팀원 모집 페이지로 돌아간다', async () => {
    setup(MOADONG_CLUB_ID, '모아동', { loadFails: true });

    expect(await screen.findByText('RECRUIT PAGE')).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('지원서를 불러오지 못했어요');
  });
});
