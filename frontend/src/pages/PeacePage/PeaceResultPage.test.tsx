import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PEACE_TYPES } from './data/peaceTypes';
import PeaceResultPage from './PeaceResultPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/PeaceLayout/PeaceLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PEACE_PAGE_TITLE: '나와 맞는 평화 활동 찾기',
}));
const mockHandleShare = jest.fn();
jest.mock('@/hooks/useShare', () => ({
  __esModule: true,
  default: () => ({ handleShare: mockHandleShare }),
}));
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <div data-testid='qr'>{value}</div>
  ),
}));
jest.mock('./components/RecommendedClubs/RecommendedClubs', () => ({
  __esModule: true,
  default: ({
    category,
    onClubClick,
  }: {
    category: string;
    onClubClick: (club: { name: string }) => void;
  }) => (
    <button
      type='button'
      onClick={() => onClubClick({ name: '테스트 동아리' })}
    >
      {`CLUBS ${category}`}
    </button>
  ),
}));
jest.mock('./components/ResultCard/ResultCard', () => ({
  __esModule: true,
  default: ({ type }: { type: { name: string } }) => (
    <div>CARD {type.name}</div>
  ),
}));

// 실제 앱은 /clubDetail/:clubId가 '@이름'을 받아 페이지 안에서 파싱한다.
// react-router에서 '@:clubName'은 동적 세그먼트가 아니라 리터럴이라 매칭되지 않는다.
const ClubProbe = () => {
  const { clubId } = useParams();
  return <div>CLUB {decodeURIComponent(clubId ?? '')}</div>;
};

const IntroProbe = () => {
  const { search } = useLocation();
  return <div>INTRO {search}</div>;
};

const renderResult = (search: string) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/peace/result${search}`]}>
        <Routes>
          <Route path='/peace' element={<IntroProbe />} />
          <Route path='/peace/result' element={<PeaceResultPage />} />
          <Route path='/clubDetail/:clubId' element={<ClubProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('PeaceResultPage', () => {
  it('유효한 type이면 카드·설명·강점·주의점·작은 행동을 그린다', () => {
    renderResult('?type=carer');
    const carer = PEACE_TYPES.carer;
    expect(screen.getByText('CARD 돌봄가')).toBeInTheDocument();
    expect(screen.getByText(carer.description)).toBeInTheDocument();
    carer.strengths.forEach((word) =>
      expect(screen.getByText(`#${word}`)).toBeInTheDocument(),
    );
    expect(screen.getByText(carer.shinesWhen)).toBeInTheDocument();
    expect(screen.getByText(carer.caution)).toBeInTheDocument();
    carer.smallActions.forEach((action) =>
      expect(screen.getByText(action)).toBeInTheDocument(),
    );
    expect(screen.getByText(carer.partnerReason)).toBeInTheDocument();
  });

  it('분과 소개와 추천 동아리는 "부경대 학생이라면?"을 눌러야 보인다', async () => {
    renderResult('?type=carer');
    expect(
      screen.queryByText(PEACE_TYPES.carer.divisionIntro),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('CLUBS 봉사')).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /부경대 학생이라면/ }),
    );
    expect(
      screen.getByText(PEACE_TYPES.carer.divisionIntro),
    ).toBeInTheDocument();
    expect(screen.getByText('CLUBS 봉사')).toBeInTheDocument();
  });

  it('type이 없으면 /peace로 돌려보낸다', () => {
    renderResult('');
    expect(screen.getByText(/^INTRO/)).toBeInTheDocument();
  });

  it('정의되지 않은 type도 /peace로 돌려보낸다', () => {
    renderResult('?type=abc');
    expect(screen.getByText(/^INTRO/)).toBeInTheDocument();
  });

  it('추천 동아리 카드를 누르면 동아리 상세로 이동한다', async () => {
    renderResult('?type=carer');
    await userEvent.click(
      screen.getByRole('button', { name: /부경대 학생이라면/ }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'CLUBS 봉사' }));
    expect(screen.getByText('CLUB @테스트 동아리')).toBeInTheDocument();
  });

  it('다시하기를 누르면 /peace로 간다', async () => {
    renderResult('?type=carer');
    await userEvent.click(screen.getByRole('button', { name: '다시하기' }));
    expect(screen.getByText(/^INTRO/)).toBeInTheDocument();
  });

  it('sub가 있으면 서브 유형 한 줄을, 없으면 생략한다', () => {
    const { unmount } = renderResult('?type=carer&sub=daily');
    expect(screen.getByText(/당신 안에는 일상가도/)).toBeInTheDocument();
    unmount();
    renderResult('?type=carer');
    expect(screen.queryByText(/당신 안에는/)).not.toBeInTheDocument();
  });

  it('잘 맞는 파트너 유형을 보여준다', () => {
    renderResult('?type=carer');
    expect(
      screen.getByRole('heading', { name: /잘 맞는 평화 파트너 · 표현가/ }),
    ).toBeInTheDocument();
  });

  it('부스 모드에서는 QR을 공유 버튼 위에 하나 더 보여준다', () => {
    renderResult('?type=carer&sub=daily&kiosk=1&src=booth');
    expect(screen.getByTestId('qr')).toHaveTextContent(
      'http://localhost/peace/result?type=carer&sub=daily&src=qr',
    );
    expect(
      screen.getByRole('button', { name: '공유하기' }),
    ).toBeInTheDocument();
  });

  it('부스 모드가 아니면 공유 버튼이 결과 링크를 공유한다', async () => {
    renderResult('?type=carer&sub=daily');
    expect(screen.queryByTestId('qr')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '공유하기' }));
    expect(mockHandleShare).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'http://localhost/peace/result?type=carer&sub=daily&src=share',
      }),
    );
  });

  it('부스 모드에서 다시하기와 유휴 리셋은 부스 파라미터를 유지한다', async () => {
    const { unmount } = renderResult('?type=carer&kiosk=1&src=booth');
    await userEvent.click(screen.getByRole('button', { name: '다시하기' }));
    expect(screen.getByText('INTRO ?kiosk=1&src=booth')).toBeInTheDocument();
    unmount();

    jest.useFakeTimers();
    renderResult('?type=carer&kiosk=1&src=booth');
    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(screen.getByText('INTRO ?kiosk=1&src=booth')).toBeInTheDocument();
    jest.useRealTimers();
  });
});
