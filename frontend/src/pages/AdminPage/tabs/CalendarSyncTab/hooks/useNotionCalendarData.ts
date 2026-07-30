import { useState } from 'react';
import {
  useApplyNotionDatabase,
  useGetNotionDatabases,
  useGetNotionPages,
} from '@/hooks/Queries/useNotionCalendar';

interface UseNotionCalendarDataParams {
  onError: (message: string) => void;
  clearError: () => void;
}

export const useNotionCalendarData = ({
  onError,
  clearError,
}: UseNotionCalendarDataParams) => {
  /** 사용자가 드롭다운에서 직접 고른 값. 비어 있으면 서버 기준값을 따른다. */
  const [pickedDatabaseId, setPickedDatabaseId] = useState('');

  const databasesQuery = useGetNotionDatabases();
  const pagesQuery = useGetNotionPages();
  const applyMutation = useApplyNotionDatabase();

  const notionDatabaseOptions = databasesQuery.data ?? [];
  const notionItems = pagesQuery.data?.items ?? [];
  const notionTotalResults = pagesQuery.data?.totalResults ?? 0;
  const notionDatabaseSourceId = pagesQuery.data?.databaseId ?? '';

  // 선택값 우선순위: 사용자가 고른 값 → 서버가 연결한 DB → 첫 번째 DB
  const selectedNotionDatabaseId =
    pickedDatabaseId ||
    notionDatabaseSourceId ||
    notionDatabaseOptions[0]?.id ||
    '';

  const applySelectedNotionDatabase = () => {
    if (!selectedNotionDatabaseId) {
      onError('먼저 Notion 데이터베이스를 선택해주세요.');
      return;
    }

    clearError();
    applyMutation.mutate(selectedNotionDatabaseId, {
      onError: (error: Error) => onError(error.message),
    });
  };

  return {
    notionItems,
    notionTotalResults,
    notionDatabaseSourceId,
    notionDatabaseOptions,
    selectedNotionDatabaseId,
    setSelectedNotionDatabaseId: setPickedDatabaseId,
    // 캐시가 있으면 로딩으로 보지 않는다 (탭 재진입 시 깜빡임 방지)
    isNotionLoading: pagesQuery.isLoading,
    isNotionDatabaseApplying: applyMutation.isPending,
    // 401·403 외의 실제 오류는 '미연동' 빈 상태와 구분되지 않아 따로 알린다
    hasDataError: databasesQuery.isError || pagesQuery.isError,
    retryData: () => {
      if (databasesQuery.isError) databasesQuery.refetch();
      if (pagesQuery.isError) pagesQuery.refetch();
    },
    /** OAuth 완료 후 데이터베이스·페이지 목록을 다시 불러온다 */
    loadNotionPages: () => {
      databasesQuery.refetch();
      return pagesQuery.refetch();
    },
    applySelectedNotionDatabase,
  };
};
