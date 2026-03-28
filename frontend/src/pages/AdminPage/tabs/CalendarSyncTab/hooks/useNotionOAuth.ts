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
  onStatus: (message: string) => void;
  clearError: () => void;
}

export const useNotionOAuth = ({
  loadNotionPages,
  onWorkspaceName,
  onError,
  onStatus,
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

  useEffect(() => {
    const clearOAuthParamsFromUrl = () => {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const hasOAuthParams = Boolean(code || state || error);
    const expectedState = sessionStorage.getItem(NOTION_STATE_KEY);

    if (error) {
      onError(`Notion OAuth 실패: ${error}`);
      sessionStorage.removeItem(NOTION_STATE_KEY);
      clearOAuthParamsFromUrl();
      return;
    }

    if (!code || !state || !expectedState || state !== expectedState) {
      if (hasOAuthParams) {
        clearOAuthParamsFromUrl();
      }
      return;
    }

    setIsNotionOAuthLoading(true);
    clearError();

    exchangeNotionCode({ code })
      .then((tokenResponse) => {
        onWorkspaceName(tokenResponse?.workspaceName ?? '');
        return loadNotionPages();
      })
      .then(() => {
        onStatus('Notion OAuth 인증이 완료되었습니다.');
      })
      .catch((oauthError: Error) => {
        onError(oauthError.message);
      })
      .finally(() => {
        setIsNotionOAuthLoading(false);
        sessionStorage.removeItem(NOTION_STATE_KEY);
        clearOAuthParamsFromUrl();
      });
  }, [clearError, loadNotionPages, onError, onStatus, onWorkspaceName]);

  return {
    isNotionOAuthLoading,
    startNotionOAuth,
  };
};
