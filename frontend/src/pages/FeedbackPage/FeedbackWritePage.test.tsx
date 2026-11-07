import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import type { FeedbackImageUploadResult } from '@/apis/feedback';
import { theme } from '@/styles/theme';
import FeedbackWritePage from './FeedbackWritePage';

const mockUpload = jest.fn<Promise<FeedbackImageUploadResult>, [File[]]>();
const mockCreate = jest.fn();
jest.mock('@/hooks/Queries/useFeedback', () => ({
  useUploadFeedbackImages: () => ({ mutateAsync: mockUpload }),
  useCreateFeedback: () => ({ mutate: mockCreate, isPending: false }),
}));
jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => () => jest.fn());
jest.mock('@/hooks/Mixpanel/useTrackPageView', () => () => {});

const CONTENT = '사진 첨부 테스트용 본문입니다.';
const urlOf = (file: File) => `https://cdn.test/feedback/${file.name}`;

/** 넘긴 파일 중 failNames에 든 것만 실패시킨다 */
const uploadResult = (files: File[], failNames: string[] = []) => ({
  urlByFile: new Map(
    files.filter((f) => !failNames.includes(f.name)).map((f) => [f, urlOf(f)]),
  ),
  failedFiles: files.filter((f) => failNames.includes(f.name)),
});

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/feedback/write/feature']}>
        <Routes>
          <Route path='/feedback/write/:type' element={<FeedbackWritePage />} />
          <Route path='/feedback/complete' element={<div>완료</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

const attach = (container: HTMLElement, files: File[]) => {
  const input = container.querySelector('input[type="file"]')!;
  fireEvent.change(input, { target: { files } });
};

const submit = async () => {
  fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: '확인' }));
  });
};

const a = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
const b = new File(['b'], 'b.jpg', { type: 'image/jpeg' });

beforeEach(() => {
  mockUpload.mockReset();
  mockCreate.mockReset();
  URL.createObjectURL = jest.fn((file: Blob) => `blob:${(file as File).name}`);
  URL.revokeObjectURL = jest.fn();
  // 확인 모달과 토스트가 Portal로 붙을 자리. 실제 앱에서는 index.html에 있다.
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

const fillForm = () => {
  const { container } = renderPage();
  fireEvent.change(screen.getByLabelText('피드백 내용'), {
    target: { value: CONTENT },
  });
  attach(container, [a, b]);
};

describe('FeedbackWritePage 사진 업로드', () => {
  it('한 장이라도 실패하면 편지를 보내지 않고 그 칸에만 재전송을 띄운다', async () => {
    mockUpload.mockImplementation(async (files) =>
      uploadResult(files, ['b.jpg']),
    );
    fillForm();

    await submit();

    expect(mockCreate).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        '사진 1장을 올리지 못했어요. 실패한 사진을 다시 보내주세요.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '첨부한 사진 1 재전송' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '첨부한 사진 2 재전송' }),
    ).toBeInTheDocument();
  });

  it('재전송은 실패한 장만 올리고, 다시 저장하면 업로드 없이 순서대로 보낸다', async () => {
    mockUpload.mockImplementation(async (files) =>
      uploadResult(files, ['b.jpg']),
    );
    fillForm();
    await submit();

    mockUpload.mockImplementation(async (files) => uploadResult(files));
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: '첨부한 사진 2 재전송' }),
      );
    });

    expect(mockUpload).toHaveBeenLastCalledWith([b]);
    expect(mockCreate).not.toHaveBeenCalled();

    await submit();

    expect(mockUpload).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith(
      { type: 'FEATURE', content: CONTENT, images: [urlOf(a), urlOf(b)] },
      expect.anything(),
    );
  });

  it('저장만 실패하면 다시 보낼 때 사진은 올리지 않는다', async () => {
    mockUpload.mockImplementation(async (files) => uploadResult(files));
    mockCreate.mockImplementationOnce((_payload, { onError }) =>
      onError(new Error('저장 실패')),
    );
    fillForm();

    await submit();
    expect(mockUpload).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);

    await submit();

    expect(mockUpload).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate.mock.calls[1][0].images).toEqual([urlOf(a), urlOf(b)]);
  });
});
