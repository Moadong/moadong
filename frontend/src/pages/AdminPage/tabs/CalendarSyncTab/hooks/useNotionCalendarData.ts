import { useEffect, useState } from 'react';
import {
  useApplyNotionDatabase,
  useGetNotionDatabases,
  useGetNotionPages,
} from '@/hooks/Queries/useNotionCalendar';

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

  // 401·403 외의 실제 오류는 '미연동' 빈 상태와 구분되지 않아 따로 알린다.
  // 백엔드 원문은 그대로 노출하지 않고 다른 캘린더 쿼리 실패와 같은 형식으로 안내한다.
  const hasNotionQueryError = Boolean(databasesQuery.error ?? pagesQuery.error);
  useEffect(() => {
    if (hasNotionQueryError) {
      onError('Notion 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [hasNotionQueryError, onError]);

  const applySelectedNotionDatabase = () => {
    if (!selectedNotionDatabaseId) {
      onError('먼저 Notion 데이터베이스를 선택해주세요.');
      return;
    }

    clearError();
    applyMutation.mutate(selectedNotionDatabaseId, {
      onSuccess: () => onStatus('선택한 Notion 데이터베이스를 연결했습니다.'),
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
    /** OAuth 완료 후 데이터베이스·페이지 목록을 다시 불러온다 */
    loadNotionPages: () => {
      databasesQuery.refetch();
      return pagesQuery.refetch();
    },
    applySelectedNotionDatabase,
  };
};
