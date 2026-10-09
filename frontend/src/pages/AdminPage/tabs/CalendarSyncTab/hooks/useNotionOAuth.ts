import { useEffect, useState } from 'react';
import {
  exchangeNotionCode,
  fetchNotionAuthorizeUrl,
} from '@/apis/calendarOAuth';
import { createState } from '@/utils/calendarSyncUtils';

const NOTION_STATE_KEY = 'admin_calendar_sync_notion_state';

interface UseNotionOAuthParams {
  loadNotionPages: () => Promise<unknown>;
  onWorkspaceName: (name: string) => void;
  onError: (message: string) => void;
  clearError: () => void;
}

export const useNotionOAuth = ({
  loadNotionPages,
  onWorkspaceName,
  onError,
  clearError,
}: UseNotionOAuthParams) => {
  const [isNotionOAuthLoading, setIsNotionOAuthLoading] = useState(false);

  const startNotionOAuth = () => {
    const state = createState();
    sessionStorage.setItem(NOTION_STATE_KEY, state);
    setIsNotionOAuthLoading(true);
    clearError();

    fetchNotionAuthorizeUrl(state)
      .then((authorizeUrl) => {
        window.location.href = authorizeUrl;
      })
      .catch((error: Error) => {
        onError(error.message);
      })
      .finally(() => {
        setIsNotionOAuthLoading(false);
      });
  };

  // 넘겨받는 콜백이 렌더마다 바뀌어 이 effect는 렌더마다 다시 돈다
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    // 콜백이 아니면 Notion으로 이동하기 직전일 수 있으니 저장한 state를 건드리지 않는다
    if (!code && !state && !error) return;

    // 다시 돌아도 같은 code를 또 교환하지 않도록 교환 전에 URL과 state를 비운다
    const expectedState = sessionStorage.getItem(NOTION_STATE_KEY);
    sessionStorage.removeItem(NOTION_STATE_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error) {
      onError(`Notion OAuth 실패: ${error}`);
      return;
    }

    if (!code || !state || !expectedState || state !== expectedState) {
      onError('Notion OAuth 인증 정보가 올바르지 않습니다.');
      return;
    }

    setIsNotionOAuthLoading(true);
    clearError();

    exchangeNotionCode({ code })
      .then((tokenResponse) => {
        onWorkspaceName(tokenResponse?.workspaceName ?? '');
        return loadNotionPages();
      })
      .then(() => {})
      .catch((oauthError: Error) => {
        onError(oauthError.message);
      })
      .finally(() => {
        setIsNotionOAuthLoading(false);
      });
  }, [clearError, loadNotionPages, onError, onWorkspaceName]);

  return {
    isNotionOAuthLoading,
    startNotionOAuth,
  };
};
