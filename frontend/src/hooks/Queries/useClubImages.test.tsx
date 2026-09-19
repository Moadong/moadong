import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { feedApi, uploadToStorage } from '@/apis/image';
import { useUploadFeed } from './useClubImages';

jest.mock('@/apis/image', () => ({
  feedApi: { getUploadUrls: jest.fn(), updateFeeds: jest.fn() },
  logoApi: {
    getUploadUrl: jest.fn(),
    completeUpload: jest.fn(),
    delete: jest.fn(),
  },
  uploadToStorage: jest.fn(),
}));

const mockedGetUploadUrls = feedApi.getUploadUrls as jest.Mock;
const mockedUploadToStorage = uploadToStorage as jest.Mock;

const makeFile = (name: string) => new File([''], name, { type: 'image/jpeg' });

const success = (name: string) => ({
  presignedUrl: `https://r2.example/put/${name}`,
  finalUrl: `https://cdn.example/${name}`,
  success: true,
  failureReason: null,
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const uploadFiles = async (files: File[]) => {
  const { result } = renderHook(() => useUploadFeed(), { wrapper });
  const promise = result.current.mutateAsync({ clubId: 'club-1', files });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  return promise;
};

describe('useUploadFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUploadToStorage.mockResolvedValue(undefined);
  });

  it('presigned 응답이 요청보다 짧아도 터지지 않고 남은 파일을 실패로 처리한다', async () => {
    // 서버는 개수 제한에 걸리면 남은 슬롯만큼 + 에러 1개만 돌려준다
    mockedGetUploadUrls.mockResolvedValue([
      success('a.jpg'),
      {
        presignedUrl: null,
        finalUrl: null,
        success: false,
        failureReason: '파일 개수 초과',
      },
    ]);

    const files = [makeFile('a.jpg'), makeFile('b.jpg'), makeFile('c.jpg')];
    const data = await uploadFiles(files);

    expect(data.failedFiles).toEqual(['b.jpg', 'c.jpg']);
    expect(data.urlByFile.get(files[0])).toBe('https://cdn.example/a.jpg');
    expect(data.urlByFile.size).toBe(1);
  });

  it('finalUrl이 없는 응답은 업로드하지 않고 실패로 처리한다', async () => {
    mockedGetUploadUrls.mockResolvedValue([
      success('a.jpg'),
      {
        presignedUrl: 'https://r2.example/put/b.jpg',
        finalUrl: '',
        success: true,
        failureReason: null,
      },
    ]);

    const files = [makeFile('a.jpg'), makeFile('b.jpg')];
    const data = await uploadFiles(files);

    expect(data.failedFiles).toEqual(['b.jpg']);
    expect(mockedUploadToStorage).toHaveBeenCalledTimes(1);
    expect(mockedUploadToStorage).toHaveBeenCalledWith(
      'https://r2.example/put/a.jpg',
      files[0],
    );
  });

  it('업로드 결과를 파일 참조 기준으로 매핑한다', async () => {
    mockedGetUploadUrls.mockResolvedValue([success('a.jpg'), success('b.jpg')]);
    mockedUploadToStorage.mockImplementation((_url: string, file: File) =>
      file.name === 'a.jpg'
        ? Promise.reject(new Error('실패'))
        : Promise.resolve(),
    );

    const files = [makeFile('a.jpg'), makeFile('b.jpg')];
    const data = await uploadFiles(files);

    expect(data.failedFiles).toEqual(['a.jpg']);
    expect(data.urlByFile.get(files[1])).toBe('https://cdn.example/b.jpg');
  });

  it('저장(updateFeeds)은 호출하지 않는다', async () => {
    mockedGetUploadUrls.mockResolvedValue([success('a.jpg')]);
    await uploadFiles([makeFile('a.jpg')]);
    expect(feedApi.updateFeeds).not.toHaveBeenCalled();
  });
});
