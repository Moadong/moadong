import { act, renderHook, waitFor } from '@testing-library/react';
import {
  exchangeNotionCode,
  fetchNotionAuthorizeUrl,
} from '@/apis/calendarOAuth';
import { useNotionOAuth } from './useNotionOAuth';

jest.mock('@/apis/calendarOAuth', () => ({
  exchangeNotionCode: jest.fn(),
  fetchNotionAuthorizeUrl: jest.fn(),
}));

jest.mock('@/utils/calendarSyncUtils', () => ({
  createState: () => 'saved-state',
}));

const NOTION_STATE_KEY = 'admin_calendar_sync_notion_state';
const PATH = '/admin/calendar-sync';

const mockExchange = exchangeNotionCode as jest.Mock;
const mockAuthorizeUrl = fetchNotionAuthorizeUrl as jest.Mock;

/** 실제 호출부처럼 loadNotionPages를 렌더마다 새 함수로 넘긴다 */
const renderNotionOAuth = () => {
  const onError = jest.fn();
  const loadNotionPages = jest.fn().mockResolvedValue(undefined);
  const view = renderHook(() =>
    useNotionOAuth({
      loadNotionPages: () => loadNotionPages(),
      onWorkspaceName: jest.fn(),
      onError,
      clearError: jest.fn(),
    }),
  );
  return { ...view, onError, loadNotionPages };
};

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  window.history.replaceState({}, '', PATH);
});

describe('useNotionOAuth', () => {
  it('Notion으로 이동하기 전 재렌더에도 저장한 state를 지우지 않는다', () => {
    // 이동(window.location.href 대입)은 jsdom에서 지원하지 않으므로 응답을 보류한다
    mockAuthorizeUrl.mockReturnValue(new Promise(() => {}));
    const { result, rerender } = renderNotionOAuth();

    act(() => result.current.startNotionOAuth());
    rerender();

    expect(sessionStorage.getItem(NOTION_STATE_KEY)).toBe('saved-state');
  });

  it('콜백으로 돌아오면 재렌더가 일어나도 code를 한 번만 교환한다', async () => {
    mockExchange.mockResolvedValue({ workspaceName: '모아동' });
    sessionStorage.setItem(NOTION_STATE_KEY, 'saved-state');
    window.history.replaceState({}, '', `${PATH}?code=abc&state=saved-state`);

    const { result, rerender, loadNotionPages } = renderNotionOAuth();
    rerender();
    rerender();

    await waitFor(() =>
      expect(result.current.isNotionOAuthLoading).toBe(false),
    );
    expect(mockExchange).toHaveBeenCalledTimes(1);
    expect(mockExchange).toHaveBeenCalledWith({ code: 'abc' });
    expect(loadNotionPages).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe('');
    expect(sessionStorage.getItem(NOTION_STATE_KEY)).toBeNull();
  });

  it('state가 다르면 교환하지 않고 오류를 알린다', () => {
    sessionStorage.setItem(NOTION_STATE_KEY, 'saved-state');
    window.history.replaceState({}, '', `${PATH}?code=abc&state=forged`);

    const { onError } = renderNotionOAuth();

    expect(mockExchange).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      'Notion OAuth 인증 정보가 올바르지 않습니다.',
    );
    expect(window.location.search).toBe('');
    expect(sessionStorage.getItem(NOTION_STATE_KEY)).toBeNull();
  });

  it('값이 빈 콜백도 오류를 알리고 URL과 state를 비운다', () => {
    sessionStorage.setItem(NOTION_STATE_KEY, 'saved-state');
    window.history.replaceState({}, '', `${PATH}?code=&state=`);

    const { onError } = renderNotionOAuth();

    expect(mockExchange).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      'Notion OAuth 인증 정보가 올바르지 않습니다.',
    );
    expect(window.location.search).toBe('');
    expect(sessionStorage.getItem(NOTION_STATE_KEY)).toBeNull();
  });
});
