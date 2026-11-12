import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { updateApplication } from '@/apis/application';
import {
  APPLICATION_FORM,
  NAME_QUESTION_ID,
} from '@/constants/applicationForm';
import { ADMIN_EVENT } from '@/constants/eventName';
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
jest.mock('@/hooks/useDevice', () => ({
  __esModule: true,
  default: () => ({
    isMobile: true,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
  }),
}));

const FORM_ID = 'form-id';

const savedForm = (): ApplicationFormData => ({
  title: '저장된 지원서',
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

const choiceForm = (): ApplicationFormData => ({
  ...savedForm(),
  questions: [
    {
      id: 2,
      title: '희망 활동',
      description: '',
      type: 'CHOICE',
      options: { required: false },
      items: [{ value: '운동' }, { value: '공연' }],
    },
  ],
});

const renderMobile = (
  form: ApplicationFormData | undefined = savedForm(),
  path = `/edit/${FORM_ID}`,
) => {
  jest.mocked(useGetApplication).mockReturnValue({
    data: form,
    isLoading: false,
    isError: false,
    error: null,
  } as unknown as ReturnType<typeof useGetApplication>);
  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route
              path='/edit/:applicationFormId'
              element={<ApplicationEditTab />}
            />
            <Route path='/new' element={<ApplicationEditTab />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>,
  );
};

const openQuestionsTab = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: '질문생성' }));

const savedPayload = () => {
  const [payload, formId] = jest.mocked(updateApplication).mock.calls[0];
  return { payload, formId };
};

describe('ApplicationEditTabMobile', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="modal-root"></div>';
    window.localStorage.clear();
    jest.clearAllMocks();
    useAdminClubStore.setState({ clubId: 'club-id' });
    jest.mocked(useAiDraftQuota).mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useAiDraftQuota>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('모바일이면 모바일 편집 화면을 그리고 데스크톱 헤더·AI 초안은 그리지 않는다', () => {
    renderMobile();

    expect(screen.getByRole('button', { name: '모아동 지원서' })).toBeVisible();
    expect(screen.getByRole('button', { name: '기본정보' })).toBeVisible();
    expect(screen.getByDisplayValue('저장된 지원서')).toBeVisible();
    expect(screen.queryByText('모아동지원서')).not.toBeInTheDocument();
    expect(screen.queryByText(/AI로 초안 생성/)).not.toBeInTheDocument();
  });

  it('모바일에서 새 지원서를 열어도 AI 초안 노출 이벤트와 잔여 횟수 조회를 하지 않는다', () => {
    renderMobile(undefined, '/new');

    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      ADMIN_EVENT.AI_DRAFT_BUTTON_VIEWED,
    );
    expect(useAiDraftQuota).toHaveBeenCalledWith('club-id', false);
  });

  it('제목·설명 글자 수와 입력 한도는 코드 한도를 쓴다', async () => {
    const user = userEvent.setup();
    renderMobile();

    expect(screen.getByText('7/50')).toBeInTheDocument();
    expect(screen.getByText('2/3000')).toBeInTheDocument();
    expect(screen.getByLabelText('지원서 제목')).toHaveAttribute(
      'maxlength',
      '50',
    );
    expect(screen.getByLabelText('지원서 설명')).toHaveAttribute(
      'maxlength',
      String(APPLICATION_FORM.APPLICATION_DESCRIPTION.maxLength),
    );

    await openQuestionsTab(user);
    expect(screen.getByLabelText('질문 1 제목')).toHaveAttribute(
      'maxlength',
      String(APPLICATION_FORM.QUESTION_TITLE.maxLength),
    );
    expect(screen.getByLabelText('질문 1 설명')).toHaveAttribute(
      'maxlength',
      String(APPLICATION_FORM.QUESTION_DESCRIPTION.maxLength),
    );
  });

  it('선택지 입력은 코드 한도(20자)를 쓴다', async () => {
    const user = userEvent.setup();
    renderMobile(choiceForm());
    await openQuestionsTab(user);

    expect(screen.getByLabelText('선택지 1')).toHaveAttribute(
      'maxlength',
      String(APPLICATION_FORM.CHOICE.maxLength),
    );
  });

  it('질문 삭제는 확인 모달을 거치고 취소하면 지워지지 않는다', async () => {
    const user = userEvent.setup();
    const confirmSpy = jest.spyOn(window, 'confirm');
    renderMobile();
    await openQuestionsTab(user);

    await user.click(screen.getByRole('button', { name: '질문 1 삭제' }));
    expect(await screen.findByText('질문을 삭제할까요?')).toBeInTheDocument();
    expect(
      screen.getByText('삭제된 질문은 복구할 수 없습니다.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.queryByText('질문을 삭제할까요?')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('지원 동기')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '질문 1 삭제' }));
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '삭제' }),
    );
    expect(screen.queryByDisplayValue('지원 동기')).not.toBeInTheDocument();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('이름 질문은 삭제할 수 없고 유형·필수 여부도 바꿀 수 없다', async () => {
    const user = userEvent.setup();
    jest.mocked(updateApplication).mockResolvedValue(undefined as never);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderMobile();
    await openQuestionsTab(user);

    // 질문 2개 중 이름 질문을 뺀 1개만 삭제 버튼이 있다
    expect(screen.queryByRole('button', { name: '질문 2 삭제' })).toBeNull();
    expect(screen.getByDisplayValue('이름을 입력해주세요')).toHaveAttribute(
      'readonly',
    );

    // 이름 질문 카드(두 번째)의 유형 선택·필수 토글은 키보드·보조기기로도 닿지 않는다
    const typeButtons = screen.getAllByRole('button', { name: '단답형' });
    const requiredButtons = screen.getAllByRole('button', { name: /답변필수/ });
    expect(typeButtons[1]).toBeDisabled();
    expect(requiredButtons[1]).toBeDisabled();
    fireEvent.click(typeButtons[1]);
    fireEvent.click(requiredButtons[1]);

    await user.click(screen.getByRole('button', { name: '저장하기' }));
    await waitFor(() => expect(updateApplication).toHaveBeenCalledTimes(1));
    const nameQuestion = savedPayload().payload.questions?.find(
      (q) => q.id === NAME_QUESTION_ID,
    );
    expect(nameQuestion).toMatchObject({
      type: 'SHORT_TEXT',
      options: { required: true },
    });
  });

  it('저장하면 데스크톱과 같은 payload로 updateApplication을 부르고 질문 id를 다시 매기지 않는다', async () => {
    const user = userEvent.setup();
    jest.mocked(updateApplication).mockResolvedValue(undefined as never);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderMobile();

    await user.click(screen.getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(updateApplication).toHaveBeenCalledTimes(1));
    const { payload, formId } = savedPayload();
    expect(formId).toBe(FORM_ID);
    expect(payload.questions?.map((q) => q.id)).toEqual([2, NAME_QUESTION_ID]);
    expect(payload).toMatchObject({
      title: '저장된 지원서',
      formMode: ApplicationFormMode.INTERNAL,
    });
  });

  it('질문을 추가해 저장해도 기존 질문 id는 그대로고 새 id는 겹치지 않는다', async () => {
    const user = userEvent.setup();
    jest.mocked(updateApplication).mockResolvedValue(undefined as never);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderMobile();
    await openQuestionsTab(user);

    await user.click(screen.getByRole('button', { name: '+ 질문 추가' }));
    await user.type(screen.getByLabelText('질문 3 제목'), '새 질문');
    await user.click(screen.getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(updateApplication).toHaveBeenCalledTimes(1));
    const ids = savedPayload().payload.questions?.map((q) => q.id) ?? [];
    expect(ids.slice(0, 2)).toEqual([2, NAME_QUESTION_ID]);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
    expect(ids[2]).toBeGreaterThan(2);
  });

  it('복수선택을 켜고 꺼도 선택지가 유지된다', async () => {
    const user = userEvent.setup();
    jest.mocked(updateApplication).mockResolvedValue(undefined as never);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderMobile(choiceForm());
    await openQuestionsTab(user);

    await user.click(screen.getByRole('button', { name: /복수선택/ }));
    expect(screen.getByLabelText('선택지 1')).toHaveValue('운동');
    expect(screen.getByLabelText('선택지 2')).toHaveValue('공연');

    await user.click(screen.getByRole('button', { name: '저장하기' }));
    await waitFor(() => expect(updateApplication).toHaveBeenCalledTimes(1));
    expect(savedPayload().payload.questions?.[0]).toMatchObject({
      type: 'MULTI_CHOICE',
      items: [{ value: '운동' }, { value: '공연' }],
    });
  });

  it('줄바꿈이 있는 질문 제목·설명을 모바일에서 고쳐도 줄바꿈이 남는다', async () => {
    const user = userEvent.setup();
    jest.mocked(updateApplication).mockResolvedValue(undefined as never);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const form = savedForm();
    form.questions![0].title = '지원 동기\n(자유롭게)';
    form.questions![0].description = '첫 줄\n둘째 줄';
    renderMobile(form);
    await openQuestionsTab(user);
    await user.click(screen.getByTestId('reorder-tooltip-dim'));

    await user.type(screen.getByLabelText('질문 1 제목'), '!');
    await user.type(screen.getByLabelText('질문 1 설명'), '!');
    await user.click(screen.getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(updateApplication).toHaveBeenCalledTimes(1));
    expect(savedPayload().payload.questions?.[0]).toMatchObject({
      title: '지원 동기\n(자유롭게)!',
      description: '첫 줄\n둘째 줄!',
    });
  });

  it('검증에 실패하면 저장하지 않는다', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderMobile();

    await user.clear(screen.getByDisplayValue('저장된 지원서'));
    await user.click(screen.getByRole('button', { name: '저장하기' }));

    expect(alertSpy).toHaveBeenCalled();
    expect(updateApplication).not.toHaveBeenCalled();
  });

  it('순서 변경 툴팁은 질문생성 탭을 처음 열 때만 보이고 딤을 누르면 닫힌다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderMobile();

    await openQuestionsTab(user);
    expect(
      screen.getByText('길게 눌러 순서를 변경할 수 있어요'),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('reorder-tooltip-dim'));
    expect(
      screen.queryByText('길게 눌러 순서를 변경할 수 있어요'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '기본정보' }));
    await openQuestionsTab(user);
    expect(
      screen.queryByText('길게 눌러 순서를 변경할 수 있어요'),
    ).not.toBeInTheDocument();

    // 다시 들어와도(저장소에 남아) 보이지 않는다
    unmount();
    renderMobile();
    await openQuestionsTab(user);
    expect(
      screen.queryByText('길게 눌러 순서를 변경할 수 있어요'),
    ).not.toBeInTheDocument();
  });

  it('툴팁이 떠 있을 때 카드를 누르면 툴팁이 닫힌다(드래그 시작도 카드를 누르며 시작한다)', async () => {
    const user = userEvent.setup();
    renderMobile();
    await openQuestionsTab(user);
    expect(
      screen.getByText('길게 눌러 순서를 변경할 수 있어요'),
    ).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByLabelText('질문 1 제목'));
    expect(
      screen.queryByText('길게 눌러 순서를 변경할 수 있어요'),
    ).not.toBeInTheDocument();
  });

  it('미리보기는 지원자 화면을 입력할 수 없게 보여 준다', async () => {
    const user = userEvent.setup();
    renderMobile();

    await user.click(screen.getByRole('button', { name: '미리보기' }));

    expect(
      screen.getByRole('group', { name: '지원서 미리보기' }),
    ).toBeDisabled();
    expect(screen.getByText('지원 동기')).toBeInTheDocument();
  });

  it('선택지 X는 글자가 있으면 지우고, 비어 있으면 항목을 없애며 최소 1개는 남긴다', async () => {
    const user = userEvent.setup();
    const form = choiceForm();
    form.questions![0].items = [{ value: '운동' }, { value: '' }];
    renderMobile(form);
    await openQuestionsTab(user);

    // 글자가 있는 선택지: X가 글자를 지운다
    await user.click(screen.getByLabelText('선택지 1'));
    await user.click(screen.getByRole('button', { name: '선택지 지우기' }));
    expect(screen.getByLabelText('선택지 1')).toHaveValue('');

    // 비어 있고 항목이 2개 이상: X가 항목을 없앤다
    await user.click(screen.getByRole('button', { name: '선택지 삭제' }));
    expect(screen.queryByLabelText('선택지 2')).not.toBeInTheDocument();

    // 마지막 1개는 비어 있어도 X가 없다
    await user.click(screen.getByLabelText('선택지 1'));
    expect(
      screen.queryByRole('button', { name: '선택지 삭제' }),
    ).not.toBeInTheDocument();
  });

  it('선택지 X는 키보드로도 누를 수 있다(입력창에서 Tab으로 옮겨도 사라지지 않는다)', async () => {
    const user = userEvent.setup();
    renderMobile(choiceForm());
    await openQuestionsTab(user);
    await user.click(screen.getByTestId('reorder-tooltip-dim'));

    await user.click(screen.getByLabelText('선택지 1'));
    await user.tab();
    expect(screen.getByRole('button', { name: '선택지 지우기' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('선택지 1')).toHaveValue('');
  });

  it('복수선택인 객관식에서 유형으로 객관식을 다시 골라도 복수선택이 유지된다', async () => {
    const user = userEvent.setup();
    renderMobile(choiceForm());
    await openQuestionsTab(user);
    await user.click(screen.getByTestId('reorder-tooltip-dim'));

    const multiToggle = screen.getByRole('button', { name: /복수선택/ });
    await user.click(multiToggle);
    expect(multiToggle).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: /^객관식/ }));
    await user.click(screen.getByRole('option', { name: '객관식' }));
    expect(screen.getByRole('button', { name: /복수선택/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('순서 변경 툴팁은 Escape로도 닫힌다', async () => {
    const user = userEvent.setup();
    renderMobile();
    await openQuestionsTab(user);
    expect(
      screen.getByText('길게 눌러 순서를 변경할 수 있어요'),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(
      screen.queryByText('길게 눌러 순서를 변경할 수 있어요'),
    ).not.toBeInTheDocument();
  });
});
