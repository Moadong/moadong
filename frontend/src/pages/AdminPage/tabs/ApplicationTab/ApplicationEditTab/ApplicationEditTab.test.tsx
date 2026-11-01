import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { updateApplication } from '@/apis/application';
import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import { ADMIN_EVENT } from '@/constants/eventName';
import { NetworkError } from '@/errors';
import {
  useAiDraftQuota,
  useGetApplication,
} from '@/hooks/Queries/useApplication';
import { useAdminClubStore } from '@/store/useAdminClubStore';
import { theme } from '@/styles/theme';
import { ApplicationFormData, ApplicationFormMode } from '@/types/application';
import ApplicationEditTab from './ApplicationEditTab';

jest.mock('@/apis/application', () => ({
  createApplication: jest.fn(),
  generateApplicationDraft: jest.fn(),
  updateApplication: jest.fn(),
}));
jest.mock('@/hooks/Queries/useApplication', () => ({
  useGetApplication: jest.fn(),
  useAiDraftQuota: jest.fn(),
}));
const mockTrackEvent = jest.fn();
jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => mockTrackEvent,
}));

const FORM_ID = 'form-id';

// 이름 질문을 두 번째로 옮겨 저장한 지원서
const savedForm = (title = '저장된 지원서'): ApplicationFormData => ({
  title,
  description: '설명',
  semesterYear: 2026,
  formMode: ApplicationFormMode.INTERNAL,
  questions: [
    {
      id: 2,
      title: '지원 동기',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: NAME_QUESTION_ID,
      title: '이름을 입력해주세요',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
  ],
});

const mockApplication = (
  state: Partial<ReturnType<typeof useGetApplication>>,
) => {
  jest.mocked(useGetApplication).mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    ...state,
  } as unknown as ReturnType<typeof useGetApplication>);
};

const renderEditTab = () => {
  const queryClient = new QueryClient();
  // rerender에 같은 엘리먼트를 넘기면 React가 다시 그리지 않으므로 매번 새로 만든다
  const ui = () => (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/edit/${FORM_ID}`]}>
          <Routes>
            <Route
              path='/edit/:applicationFormId'
              element={<ApplicationEditTab />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
  const result = render(ui());
  return { ...result, rerenderEditTab: () => result.rerender(ui()) };
};

const isBefore = (a: HTMLElement, b: HTMLElement) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe('ApplicationEditTab', () => {
  beforeEach(() => {
    useAdminClubStore.setState({ clubId: 'club-id' });
    jest.mocked(useAiDraftQuota).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useAiDraftQuota>);
  });

  it('캐시에 지원서가 이미 있으면 첫 렌더부터 저장된 질문 순서로 그린다', () => {
    mockApplication({ data: savedForm() });

    renderEditTab();

    expect(
      isBefore(
        screen.getByDisplayValue('지원 동기'),
        screen.getByDisplayValue('이름을 입력해주세요'),
      ),
    ).toBe(true);
  });

  it('지원서가 늦게 오면 기본 템플릿을 그리지 않고 도착한 순서로 그린다', () => {
    mockApplication({ isLoading: true });
    const { rerenderEditTab } = renderEditTab();

    // 로딩 중에는 템플릿의 이름 질문이 그려지지 않는다
    expect(
      screen.queryByDisplayValue('이름을 입력해주세요'),
    ).not.toBeInTheDocument();

    mockApplication({ data: savedForm() });
    rerenderEditTab();

    expect(
      isBefore(
        screen.getByDisplayValue('지원 동기'),
        screen.getByDisplayValue('이름을 입력해주세요'),
      ),
    ).toBe(true);
  });

  it('외부 지원서로 저장된 지원서는 첫 렌더부터 외부 링크를 보여 준다', () => {
    mockApplication({
      data: {
        ...savedForm(),
        formMode: ApplicationFormMode.EXTERNAL,
        externalApplicationUrl: 'https://forms.gle/example',
      },
    });

    renderEditTab();

    expect(
      screen.getByDisplayValue('https://forms.gle/example'),
    ).toBeInTheDocument();
  });

  it('같은 지원서를 다시 불러와도 편집 중인 제목을 덮어쓰지 않는다', async () => {
    mockApplication({ data: savedForm() });
    const { rerenderEditTab } = renderEditTab();

    const title = screen.getByPlaceholderText('지원서 제목을 입력하세요');
    await userEvent.clear(title);
    await userEvent.type(title, '편집 중인 제목');

    // 다시 불러오기로 서버 데이터가 새 객체로 온 경우
    mockApplication({ data: savedForm('서버에서 바뀐 제목') });
    rerenderEditTab();

    expect(title).toHaveValue('편집 중인 제목');
  });
  it('받아 둔 지원서가 있으면 다시 불러오기가 실패해도 편집 중인 내용을 유지한다', async () => {
    mockApplication({ data: savedForm() });
    const { rerenderEditTab } = renderEditTab();

    const title = screen.getByPlaceholderText('지원서 제목을 입력하세요');
    await userEvent.clear(title);
    await userEvent.type(title, '편집 중인 제목');

    // 백그라운드 재조회 실패: 이전 데이터는 남아 있고 isError만 true가 된다
    mockApplication({
      data: savedForm(),
      isError: true,
      error: new Error('네트워크 오류'),
    });
    rerenderEditTab();

    expect(title).toBeInTheDocument();
    expect(title).toHaveValue('편집 중인 제목');
  });

  it('받아 둔 지원서 없이 불러오기가 실패하면 실패 안내를 보여 준다', () => {
    mockApplication({ isError: true, error: new Error('네트워크 오류') });

    renderEditTab();

    expect(
      screen.getByText(/지원서 정보를 불러오는데 실패했습니다/),
    ).toBeInTheDocument();
  });
  it('저장이 실패하면 실패 원인과 함께 이벤트를 남긴다', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.mocked(updateApplication).mockRejectedValue(new NetworkError());
    mockApplication({ data: savedForm() });
    renderEditTab();

    await userEvent.click(screen.getByRole('button', { name: '저장하기' }));

    await waitFor(() =>
      expect(mockTrackEvent).toHaveBeenCalledWith(
        ADMIN_EVENT.APPLICATION_FORM_SAVE_FAILED,
        expect.objectContaining({
          is_edit: true,
          form_mode: ApplicationFormMode.INTERNAL,
          error_type: 'network',
        }),
      ),
    );
  });
});
