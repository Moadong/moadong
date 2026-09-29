import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PEACE_QUESTIONS } from './data/questions';
import PeaceQuizPage from './PeaceQuizPage';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));
jest.mock('./components/PeaceLayout/PeaceLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PEACE_PAGE_TITLE: '나와 맞는 평화 활동 찾기',
}));

const ResultProbe = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <div>RESULT {search}</div>
      <button type='button' onClick={() => navigate(-1)}>
        뒤로
      </button>
    </div>
  );
};

const renderQuiz = (search = '') =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter
        initialEntries={['/peace', `/peace/quiz${search}`]}
        initialIndex={1}
      >
        {/* 헤더 로고처럼 퀴즈 밖에서 페이지를 떠나게 하는 링크 */}
        <Link to='/peace'>홈으로</Link>
        <Routes>
          <Route path='/peace' element={<div>INTRO</div>} />
          <Route path='/peace/quiz' element={<PeaceQuizPage />} />
          <Route path='/peace/result' element={<ResultProbe />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

/** 8문항을 첫 선택지로 답한다. 탭 가드(300ms) 때문에 문항 사이에 가짜 시간을 흘린다 */
const answerAll = () => {
  jest.useFakeTimers();
  for (let i = 0; i < PEACE_QUESTIONS.length; i += 1) {
    // 모두 첫 번째 선택지: energizer, daily, carer, carer, carer, carer, embracer, carer → carer 5점
    fireEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[i].options[0].label }),
    );
    act(() => {
      jest.advanceTimersByTime(400);
    });
  }
};

/** 분석 중 화면(ANALYZING_MS)을 지나 결과로 넘어갈 때까지 시간을 흘린다 */
const finishAnalyzing = () => {
  act(() => {
    jest.advanceTimersByTime(2000);
  });
};

describe('PeaceQuizPage', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('첫 문항과 Q1 라벨, 진행 표시 1 / 8을 그린다', () => {
    renderQuiz();
    expect(screen.getByText(PEACE_QUESTIONS[0].text)).toBeInTheDocument();
    expect(screen.getByText('Q1.')).toBeInTheDocument();
    expect(screen.getByText('1 / 8')).toBeInTheDocument();
  });

  it('선택지를 누르면 다음 문항으로 넘어간다', async () => {
    renderQuiz();
    await userEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[0].options[0].label }),
    );
    expect(screen.getByText(PEACE_QUESTIONS[1].text)).toBeInTheDocument();
    expect(screen.getByText('2 / 8')).toBeInTheDocument();
  });

  it('이전 버튼은 앞 문항으로 돌아가고, 첫 문항에서는 /peace로 간다', async () => {
    renderQuiz();
    await userEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[0].options[0].label }),
    );
    await userEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByText('1 / 8')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });

  it('답 직후 이어진 탭은 다음 문항의 답으로 잡히지 않는다', () => {
    jest.useFakeTimers();
    renderQuiz();
    fireEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[0].options[0].label }),
    );
    // 리렌더 뒤 같은 자리에 있는 2번 문항 버튼을 곧바로 다시 탭
    fireEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[1].options[0].label }),
    );
    expect(screen.getByText('2 / 8')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(400);
    });
    fireEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[1].options[0].label }),
    );
    expect(screen.getByText('3 / 8')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('8문항을 모두 답하면 분석 중 화면을 보여준 뒤 결과로 이동한다', () => {
    renderQuiz();
    answerAll();
    expect(screen.getByText(/분석하고 있어요/)).toBeInTheDocument();
    expect(screen.queryByText(/^RESULT/)).not.toBeInTheDocument();
    finishAnalyzing();
    // 2등은 1점 동점(energizer·daily·embracer) 중 TIE_BREAK_ORDER 첫 항목인 daily
    expect(
      screen.getByText('RESULT ?type=carer&sub=daily'),
    ).toBeInTheDocument();
  });

  it('분석 중에 페이지를 떠나면 결과로 끌려가지 않는다', () => {
    renderQuiz();
    answerAll();
    expect(screen.getByText(/분석하고 있어요/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: '홈으로' }));
    expect(screen.getByText('INTRO')).toBeInTheDocument();
    finishAnalyzing();
    expect(screen.getByText('INTRO')).toBeInTheDocument();
    expect(screen.queryByText(/^RESULT/)).not.toBeInTheDocument();
  });

  it('부스 모드 파라미터를 결과로 이어 넘긴다', () => {
    renderQuiz('?kiosk=1&src=booth');
    answerAll();
    finishAnalyzing();
    expect(
      screen.getByText('RESULT ?type=carer&sub=daily&kiosk=1&src=booth'),
    ).toBeInTheDocument();
  });

  it('부스 모드에서 60초 동안 입력이 없으면 랜딩으로 돌아간다', () => {
    jest.useFakeTimers();
    renderQuiz('?kiosk=1');
    fireEvent.click(
      screen.getByRole('button', { name: PEACE_QUESTIONS[0].options[0].label }),
    );
    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(screen.getByText('INTRO')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('부스 모드가 아니면 시간이 지나도 그대로다', () => {
    jest.useFakeTimers();
    renderQuiz();
    act(() => {
      jest.advanceTimersByTime(120_000);
    });
    expect(screen.getByText('1 / 8')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('결과에서 뒤로 가면 퀴즈가 아니라 랜딩으로 간다', () => {
    // 퀴즈→결과가 replace라 히스토리는 [/peace, /peace/result]
    renderQuiz();
    answerAll();
    finishAnalyzing();
    fireEvent.click(screen.getByRole('button', { name: '뒤로' }));
    expect(screen.getByText('INTRO')).toBeInTheDocument();
  });
});
