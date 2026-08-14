import { useEffect, useMemo, useState } from 'react';
import { useGetApplicants } from './Queries/useApplicants';
import { useApplicantSSE } from './useApplicantSSE';
import { ApplicationStatus } from '@/types/applicants';

export type ApplicantFilter = 'ALL' | ApplicationStatus;
export type ApplicantSort = 'date' | 'name';

export const useApplicantList = (
  applicationFormId: string | undefined,
  options?: {
    initialSort?: ApplicantSort;
    initialKeyword?: string;
    initialFilter?: ApplicantFilter[];
  },
) => {
  const { applicantsData, setApplicantsData } = useApplicantSSE(
    applicationFormId || undefined,
  );
  const { data: fetchedData, isLoading } = useGetApplicants(
    applicationFormId ?? '',
  );

  const [keyword, setKeyword] = useState(options?.initialKeyword ?? '');
  const [selectedFilter, setSelectedFilter] = useState<ApplicantFilter[]>(
    options?.initialFilter ?? ['ALL'],
  );
  const [selectedSort, setSelectedSort] = useState<ApplicantSort>(
    options?.initialSort ?? 'date',
  );

  useEffect(() => {
    if (fetchedData) setApplicantsData(fetchedData);
  }, [fetchedData, setApplicantsData]);

  const filteredApplicants = useMemo(() => {
    const data = applicantsData ?? fetchedData;
    if (!data?.applicants) return [];
    let list = [...data.applicants];

    if (!selectedFilter.includes('ALL')) {
      list = list.filter((a) =>
        selectedFilter.includes(a.status as ApplicantFilter),
      );
    }

    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter((a) =>
        a.answers?.[0]?.value?.toLowerCase().includes(kw),
      );
    }

    if (selectedSort === 'name') {
      list.sort((a, b) =>
        a.answers?.[0]?.value.localeCompare(b.answers?.[0]?.value),
      );
    } else {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return list;
  }, [applicantsData, fetchedData, selectedFilter, keyword, selectedSort]);

  return {
    applicantsData,
    filteredApplicants,
    isLoading,
    keyword,
    setKeyword,
    selectedFilter,
    setSelectedFilter,
    selectedSort,
    setSelectedSort,
  };
};
