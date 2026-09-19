import { act, renderHook, waitFor } from '@testing-library/react';
import { PromotionArticle } from '@/types/promotion';
import { usePromotionForm } from './usePromotionForm';

const createArticle = jest.fn();
const updateArticle = jest.fn();
const uploadImages = jest.fn();

jest.mock('@/hooks/Queries/usePromotion', () => ({
  useCreatePromotionArticle: () => ({ mutateAsync: createArticle }),
  useUpdatePromotionArticle: () => ({ mutateAsync: updateArticle }),
  useUploadPromotionImages: () => ({ mutateAsync: uploadImages }),
}));

const article: PromotionArticle = {
  id: 'a1',
  clubId: 'club-1',
  clubName: '극예술연구회',
  title: '봄 정기공연',
  location: '한울관(E31) 302호',
  latitude: 35.132367,
  longitude: 129.106974,
  eventStartDate: '2026-04-01T01:00:00Z',
  eventEndDate: '2026-04-01T03:00:00Z',
  description: '설명',
  images: ['https://cdn/old1.png', 'https://cdn/old2.png'],
};

const makeFile = (name: string) => new File(['x'], name, { type: 'image/png' });

beforeEach(() => {
  jest.clearAllMocks();
  global.URL.createObjectURL = jest.fn((file) => `blob:${(file as File).name}`);
  global.URL.revokeObjectURL = jest.fn();
});

describe('usePromotionForm 이미지 순서', () => {
  it('새 파일을 앞으로 끌어다 놓으면 그 순서 그대로 저장된다', async () => {
    const newFile = makeFile('new.png');
    uploadImages.mockResolvedValue({
      uploaded: [{ file: newFile, url: 'https://cdn/new.png' }],
      failedFiles: [],
    });
    updateArticle.mockResolvedValue({});

    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.addFiles([newFile]));
    // [old1, old2, new] → 새 파일을 맨 앞으로
    act(() => {
      const [old1, old2, added] = result.current.values.images;
      result.current.reorderImages([added, old1, old2]);
    });

    await act(async () => {
      await result.current.save();
    });

    await waitFor(() => expect(updateArticle).toHaveBeenCalled());
    expect(updateArticle.mock.calls[0][0].payload.images).toEqual([
      'https://cdn/new.png',
      'https://cdn/old1.png',
      'https://cdn/old2.png',
    ]);
  });

  it('업로드에 실패한 파일은 빠지고 나머지 순서는 유지된다', async () => {
    const okFile = makeFile('ok.png');
    const badFile = makeFile('bad.png');
    uploadImages.mockResolvedValue({
      uploaded: [{ file: okFile, url: 'https://cdn/ok.png' }],
      failedFiles: [badFile],
    });
    updateArticle.mockResolvedValue({});

    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.addFiles([badFile, okFile]));
    // [old1, old2, bad, ok] → [bad, old1, ok, old2]
    act(() => {
      const [old1, old2, bad, ok] = result.current.values.images;
      result.current.reorderImages([bad, old1, ok, old2]);
    });

    let saveResult;
    await act(async () => {
      saveResult = await result.current.save();
    });

    expect(updateArticle.mock.calls[0][0].payload.images).toEqual([
      'https://cdn/old1.png',
      'https://cdn/ok.png',
      'https://cdn/old2.png',
    ]);
    expect(saveResult).toEqual({
      status: 'partial',
      articleId: 'a1',
      failedCount: 1,
    });
  });

  it('업로드에 실패한 이미지는 failed로 표시되고 미리보기는 살려 둔다', async () => {
    const okFile = makeFile('ok.png');
    const badFile = makeFile('bad.png');
    uploadImages.mockResolvedValue({
      uploaded: [{ file: okFile, url: 'https://cdn/ok.png' }],
      failedFiles: [badFile],
    });
    updateArticle.mockResolvedValue({});

    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.addFiles([okFile, badFile]));
    await act(async () => {
      await result.current.save();
    });

    // File을 통째로 비교하면 실패 시 jest가 diff를 뜨다 힙을 터뜨린다. 스칼라만 본다
    const images = result.current.values.images;
    expect(
      images.map((item) => (item.type === 'uploaded' ? item.url : item.status)),
    ).toEqual([
      'https://cdn/old1.png',
      'https://cdn/old2.png',
      'https://cdn/ok.png',
      'failed',
    ]);

    const failed = images[3];
    expect(failed.type).toBe('local');
    if (failed.type === 'local') {
      expect(failed.file).toBe(badFile);
      expect(failed.previewUrl).toBe('blob:bad.png');
    }
    // 실패 항목은 계속 보여줘야 하므로 revoke하면 안 된다
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalledWith('blob:bad.png');
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:ok.png');
  });

  it('실패했던 이미지가 다시 저장에서 성공하면 uploaded로 바뀐다', async () => {
    const badFile = makeFile('bad.png');
    uploadImages.mockResolvedValueOnce({
      uploaded: [],
      failedFiles: [badFile],
    });
    updateArticle.mockResolvedValue({});

    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.addFiles([badFile]));
    await act(async () => {
      await result.current.save();
    });
    const firstTry = result.current.values.images[2];
    expect(firstTry.type).toBe('local');
    if (firstTry.type === 'local') expect(firstTry.status).toBe('failed');

    uploadImages.mockResolvedValueOnce({
      uploaded: [{ file: badFile, url: 'https://cdn/late.png' }],
      failedFiles: [],
    });
    await act(async () => {
      await result.current.save();
    });

    const secondTry = result.current.values.images[2];
    expect(secondTry.type).toBe('uploaded');
    if (secondTry.type === 'uploaded')
      expect(secondTry.url).toBe('https://cdn/late.png');
  });

  it('이미지를 모두 지워도 나머지 수정은 저장한다', async () => {
    uploadImages.mockResolvedValue({ uploaded: [], failedFiles: [] });
    updateArticle.mockResolvedValue({});

    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.removeImage(1));
    act(() => result.current.removeImage(0));
    act(() => result.current.setField('title', '고친 제목'));

    let saveResult;
    await act(async () => {
      saveResult = await result.current.save();
    });

    // PUT을 건너뛰면 제목 수정이 조용히 사라진다
    expect(updateArticle).toHaveBeenCalledTimes(1);
    expect(updateArticle.mock.calls[0][0].payload).toMatchObject({
      title: '고친 제목',
      images: [],
    });
    expect(saveResult).toEqual({ status: 'success', articleId: 'a1' });
  });

  it('업로드가 모두 실패해 한 장도 안 남으면 빈 목록으로 덮어쓰지 않는다', async () => {
    const badFile = makeFile('bad.png');
    uploadImages.mockResolvedValue({ uploaded: [], failedFiles: [badFile] });

    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.removeImage(1));
    act(() => result.current.removeImage(0));
    act(() => result.current.addFiles([badFile]));

    let saveResult;
    await act(async () => {
      saveResult = await result.current.save();
    });

    expect(updateArticle).not.toHaveBeenCalled();
    expect(saveResult).toEqual({
      status: 'error',
      message: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
    });
  });

  it('생성 후 실패한 저장을 재시도해도 글을 다시 만들지 않는다', async () => {
    const file = makeFile('new.png');
    createArticle.mockResolvedValue({ articleId: 'created-1' });
    uploadImages
      .mockRejectedValueOnce(new Error('업로드 실패'))
      .mockResolvedValueOnce({
        uploaded: [{ file, url: 'https://cdn/new.png' }],
        failedFiles: [],
      });
    updateArticle.mockResolvedValue({});

    const { result } = renderHook(() => usePromotionForm({ clubId: 'club-1' }));

    act(() => {
      result.current.setField('title', '봄 정기공연');
      result.current.setField('location', '한울관(E31) 302호');
      result.current.setField('coordinates', {
        lat: 35.132367,
        lng: 129.106974,
      });
      result.current.setField('eventStart', new Date('2026-04-01T10:00:00'));
      result.current.setField('eventEnd', new Date('2026-04-01T12:00:00'));
      result.current.setField('description', '설명');
    });
    act(() => result.current.addFiles([file]));

    let firstResult;
    await act(async () => {
      firstResult = await result.current.save();
    });
    expect(firstResult).toMatchObject({ status: 'error' });

    let secondResult;
    await act(async () => {
      secondResult = await result.current.save();
    });

    expect(createArticle).toHaveBeenCalledTimes(1);
    expect(secondResult).toEqual({ status: 'success', articleId: 'created-1' });
    expect(updateArticle.mock.calls[0][0].articleId).toBe('created-1');
  });

  it('삭제한 로컬 이미지의 previewUrl은 revoke한다', () => {
    const { result } = renderHook(() =>
      usePromotionForm({ clubId: 'club-1', article }),
    );

    act(() => result.current.addFiles([makeFile('temp.png')]));
    act(() => result.current.removeImage(2));

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:temp.png');
    expect(result.current.values.images).toHaveLength(2);
  });
});
