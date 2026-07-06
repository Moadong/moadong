import { ApplicationFormGroup } from '@/types/application';

/**
 * 지원서 그룹(연도 + 활성 여부)의 표시 라벨과 리스트 key용 고유 prefix를 계산한다.
 * ApplicationListTab·ApplicantsListTab 두 탭에서 동일하게 사용한다.
 */
export const getFormGroupLabel = (group: ApplicationFormGroup) => {
  const statusLabel = group.active ? '활성' : '비활성';
  return {
    title: `${group.semesterYear}년 ${statusLabel}`,
    uniqueKeyPrefix: `group_${group.semesterYear}_${group.active}`,
  };
};
