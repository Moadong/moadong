import { useEffect, useMemo, useState } from 'react';
import {
  ApplicantFilter,
  ApplicantSort,
  filterAndSortApplicants,
} from '@/utils/filterAndSortApplicants';
import { useGetApplicants } from './Queries/useApplicants';
import { useApplicantSSE } from './useApplicantSSE';

export type { ApplicantFilter, ApplicantSort };

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
    return filterAndSortApplicants(data.applicants, {
      selectedFilter,
      keyword,
      selectedSort,
    });
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
