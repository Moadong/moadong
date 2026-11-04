import { Applicant, ApplicationStatus } from '@/types/applicants';
import { getApplicantName } from '@/utils/getApplicantName';

export type ApplicantFilter = 'ALL' | ApplicationStatus;
export type ApplicantSort = 'date' | 'name';

/** 지원자 목록을 상태로 거르고, 이름 키워드로 거른 뒤, 이름순 또는 최신순으로 정렬한다 */
export const filterAndSortApplicants = (
  applicants: Applicant[],
  {
    selectedFilter,
    keyword,
    selectedSort,
  }: {
    selectedFilter: ApplicantFilter[];
    keyword: string;
    selectedSort: ApplicantSort;
  },
) => {
  let list = [...applicants];

  if (!selectedFilter.includes('ALL')) {
    list = list.filter((a) =>
      selectedFilter.includes(a.status as ApplicantFilter),
    );
  }

  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase();
    list = list.filter((a) =>
      getApplicantName(a.answers ?? [])
        ?.toLowerCase()
        .includes(kw),
    );
  }

  if (selectedSort === 'name') {
    list.sort((a, b) =>
      (getApplicantName(a.answers ?? []) ?? '').localeCompare(
        getApplicantName(b.answers ?? []) ?? '',
      ),
    );
  } else {
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return list;
};
