import { ApplicationFormGroup, ApplicationFormItem } from '@/types/application';

export interface MergedFormGroup {
  title: string;
  uniqueKeyPrefix: string;
  forms: ApplicationFormItem[];
}

/**
 * 연도+활성 여부로 나뉜 그룹들을 연도 구분 없이 활성/비활성 두 섹션으로 병합한다.
 * 각 섹션 내부는 최종 수정일 최신순으로 정렬한다.
 * ApplicationListTab·ApplicantsListTab 두 탭에서 동일하게 사용한다.
 */
export const groupFormsByActiveStatus = (
  groups: ApplicationFormGroup[],
): MergedFormGroup[] => {
  const sections = [
    { active: true, title: '활성', uniqueKeyPrefix: 'group_active' },
    { active: false, title: '비활성', uniqueKeyPrefix: 'group_inactive' },
  ];

  return sections
    .map(({ active, title, uniqueKeyPrefix }) => ({
      title,
      uniqueKeyPrefix,
      forms: groups
        .filter((group) => group.active === active)
        .flatMap((group) => group.forms)
        .sort(
          (a, b) =>
            b.editedAt.localeCompare(a.editedAt) || b.id.localeCompare(a.id),
        ),
    }))
    .filter((section) => section.forms.length > 0);
};
