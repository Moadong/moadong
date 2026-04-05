import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchNotionDatabasePages,
  fetchNotionDatabases,
  fetchNotionPages,
  NotionDatabaseOption,
  NotionPagesResponse,
  NotionSearchItem,
} from '@/apis/calendarOAuth';

interface UseNotionCalendarDataParams {
  onError: (message: string) => void;
  onStatus: (message: string) => void;
  clearError: () => void;
}

export const useNotionCalendarData = ({
  onError,
  onStatus,
  clearError,
}: UseNotionCalendarDataParams) => {
  const [notionItems, setNotionItems] = useState<NotionSearchItem[]>([]);
  const [notionTotalResults, setNotionTotalResults] = useState(0);
  const [notionDatabaseSourceId, setNotionDatabaseSourceId] = useState('');
  const [notionDatabaseOptions, setNotionDatabaseOptions] = useState<
    NotionDatabaseOption[]
  >([]);
  const [selectedNotionDatabaseId, setSelectedNotionDatabaseId] = useState('');
  const [isNotionLoading, setIsNotionLoading] = useState(false);
  const [isNotionDatabaseApplying, setIsNotionDatabaseApplying] =
    useState(false);

  const pagesRequestIdRef = useRef(0);

  const applyPagesResponse = useCallback((response: NotionPagesResponse) => {
    setNotionItems(response.items);
    setNotionTotalResults(response.totalResults);
    const databaseId = response.databaseId ?? '';
    setNotionDatabaseSourceId(databaseId);
    if (databaseId) {
      setSelectedNotionDatabaseId(databaseId);
    }
  }, []);

  const loadNotionPages = useCallback(async () => {
    const requestId = ++pagesRequestIdRef.current;
    setIsNotionLoading(true);
    try {
      const response = await fetchNotionPages();
      if (requestId !== pagesRequestIdRef.current) {
        return null;
      }
      applyPagesResponse(response);
      return response;
    } catch (error: unknown) {
      const status =
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof (error as { status?: unknown }).status === 'number'
          ? (error as { status: number }).status
          : undefined;

      if (status === 401 || status === 403) {
        return null;
      }

      if (error instanceof Error) {
        onError(error.message);
      }
      return null;
    } finally {
      setIsNotionLoading(false);
    }
  }, [applyPagesResponse, onError]);

  const applySelectedNotionDatabase = useCallback(() => {
    if (!selectedNotionDatabaseId) {
      onError('먼저 Notion 데이터베이스를 선택해주세요.');
      return;
    }

    setIsNotionDatabaseApplying(true);
    clearError();

    const requestId = ++pagesRequestIdRef.current;
    fetchNotionDatabasePages({
      databaseId: selectedNotionDatabaseId,
    })
      .then((pagesResponse) => {
        if (requestId !== pagesRequestIdRef.current) {
          return;
        }
        applyPagesResponse(pagesResponse);
        onStatus('선택한 Notion 데이터베이스를 연결했습니다.');
      })
      .catch((error: Error) => {
        onError(error.message);
      })
      .finally(() => {
        setIsNotionDatabaseApplying(false);
      });
  }, [
    applyPagesResponse,
    clearError,
    onError,
    onStatus,
    selectedNotionDatabaseId,
  ]);

  useEffect(() => {
    fetchNotionDatabases()
      .then((options) => {
        setNotionDatabaseOptions(options);
        setSelectedNotionDatabaseId(
          (previous) => previous || options[0]?.id || '',
        );
      })
      .catch(() => {
        // OAuth 전 단계에서는 목록 실패가 자연스러울 수 있다.
      });
  }, []);

  useEffect(() => {
    loadNotionPages();
  }, [loadNotionPages]);

  return {
    notionItems,
    notionTotalResults,
    notionDatabaseSourceId,
    notionDatabaseOptions,
    selectedNotionDatabaseId,
    setSelectedNotionDatabaseId,
    isNotionLoading,
    isNotionDatabaseApplying,
    applyPagesResponse,
    loadNotionPages,
    applySelectedNotionDatabase,
  };
};
