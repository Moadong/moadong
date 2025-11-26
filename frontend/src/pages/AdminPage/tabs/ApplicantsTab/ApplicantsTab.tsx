import { useAdminClubContext } from '@/context/AdminClubContext';
import { Applicant, ApplicationStatus } from '@/types/applicants';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteApplicants } from '@/hooks/queries/applicants/useDeleteApplicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import { useUpdateApplicant } from '@/hooks/queries/applicants/useUpdateApplicant';
import { AVAILABLE_STATUSES } from '@/constants/status';
import { useGetApplicants } from '@/hooks/queries/applicants/useGetApplicants';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopApplicantsTab from './DesktopApplicantsTab';
import MobileApplicantsTab from './MobileApplicantsTab';

const ApplicantsTab = () => {
  const statusOptions = AVAILABLE_STATUSES.map((status) => ({
    value: status,
    label: mapStatusToGroup(status).label,
  }));

  const filterOptions = ['ALL', ...Object.values(ApplicationStatus)].map(
    (status) => ({
      value: status,
      label:
        status === 'ALL'
          ? '전체'
          : mapStatusToGroup(status as ApplicationStatus).label,
    }),
  );

  const sortOptions: { value: 'date' | 'name'; label: string }[] = [
    { value: 'date', label: '제출순' },
    { value: 'name', label: '이름순' },
  ];

  const navigate = useNavigate();
  const { clubId, applicantsData, applicationFormId, setApplicantsData } =
    useAdminClubContext();
  const {
    data: fetchData,
    isLoading,
    isError,
  } = useGetApplicants(applicationFormId ?? '');
  const [keyword, setKeyword] = useState('');
  const [checkedItem, setCheckedItem] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<
    (typeof sortOptions)[number]
  >(sortOptions[0]);
  const isMobile = useIsMobileView();

  useEffect(() => {
    if (fetchData) {
      setApplicantsData(fetchData);
    }
  }, [fetchData, setApplicantsData]);

  // 모든 드롭다운을 닫는 함수
  const closeAllDropdowns = () => {
    if (open) setOpen(false);
    if (isStatusDropdownOpen) setIsStatusDropdownOpen(false);
    if (isFilterOpen) setIsFilterOpen(false);
    if (isSortOpen) setIsSortOpen(false);
  };
  const { mutate: deleteApplicants } = useDeleteApplicants(clubId!);
  const { mutate: updateDetailApplicants } = useUpdateApplicant(
    applicationFormId ?? '',
  );
  const dropdownRef = useRef<Array<HTMLDivElement | null>>([]);

  const filteredApplicants = useMemo(() => {
    if (!applicantsData?.applicants) return [];

    let applicants = [...applicantsData.applicants];

    if (selectedFilter !== 'ALL') {
      applicants = applicants.filter(
        (applicant) => applicant.status === selectedFilter,
      );
    }

    if (keyword.trim()) {
      applicants = applicants.filter((user: Applicant) =>
        user.answers?.[0]?.value
          ?.toLowerCase()
          .includes(keyword.trim().toLowerCase()),
      );
    }

    if (selectedSort.value === 'name') {
      applicants.sort((a, b) =>
        a.answers?.[0]?.value.localeCompare(b.answers?.[0]?.value),
      );
    } else {
      applicants.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return applicants;
  }, [applicantsData, keyword, selectedFilter, selectedSort.value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.some((ref) => ref && ref.contains(target))
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, isStatusDropdownOpen, isFilterOpen, isSortOpen]);

  useEffect(() => {
    const newMap = new Map<string, boolean>();
    filteredApplicants.forEach((user: Applicant) => {
      newMap.set(user.id, false);
    });
    setCheckedItem(newMap);
  }, [filteredApplicants]);

  useEffect(() => {
    const all =
      checkedItem.size > 0 && Array.from(checkedItem.values()).every(Boolean);
    setSelectAll(all);
    setIsChecked(Array.from(checkedItem.values()).some(Boolean));
  }, [checkedItem]);

  if (!clubId) return null;

  const deleteSelectApplicants = (ids: string[]) => {
    if (ids.length === 0) return;

    const check = confirm(
      `${ids.length}개의 지원자를 정말로 삭제하시겠습니까?\n삭제된 지원자는 복구할 수 없습니다.`,
    );
    if (!check) return;

    deleteApplicants(
      { applicantIds: ids },
      {
        onSuccess: () => {
          setCheckedItem(new Map());
          alert('삭제되었습니다.');
        },
        onError: () => {
          alert('지원자 삭제에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const selectApplicantsByStatus = (
    mode: 'all' | 'filter',
    ...args: ApplicationStatus[]
  ) => {
    if (checkedItem.size === 0 || filteredApplicants.length === 0) return;

    setCheckedItem((prev) => {
      const newMap = new Map(prev);

      const isAllChecked = Array.from(prev.values()).every(Boolean);

      if (mode === 'all') {
        newMap.forEach((_, key) => newMap.set(key, !isAllChecked));
        return newMap;
      }

      newMap.forEach((_, key) => {
        newMap.set(key, false);
      });

      filteredApplicants
        .filter((applicant) => args.includes(applicant.status))
        .forEach((applicant) => {
          newMap.set(applicant.id, true);
        });
      return newMap;
    });
  };

  const checkoutAllApplicants = () => {
    setCheckedItem((prev) => {
      const newMap = new Map(prev);
      newMap.forEach((_, key) => {
        newMap.set(key, false);
      });
      return newMap;
    });
  };

  const updateAllApplicants = (status: ApplicationStatus) => {
    updateDetailApplicants(
      applicantsData!.applicants
        .filter((applicant) => checkedItem.get(applicant.id))
        .map((applicant) => ({
          applicantId: applicant.id,
          memo: applicant.memo,
          status: status,
        })),
      {
        onSuccess: () => {
          checkoutAllApplicants();
        },
        onError: () => {
          alert('지원자 상태 변경에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const props = {
    applicantsData,
    filteredApplicants,
    keyword,
    setKeyword,
    checkedItem,
    setCheckedItem,
    selectAll,
    open,
    setOpen,
    isStatusDropdownOpen,
    setIsStatusDropdownOpen,
    isChecked,
    isFilterOpen,
    setIsFilterOpen,
    selectedFilter,
    setSelectedFilter,
    isSortOpen,
    setIsSortOpen,
    selectedSort,
    setSelectedSort,
    closeAllDropdowns,
    dropdownRef,
    deleteSelectApplicants,
    selectApplicantsByStatus,
    updateAllApplicants,
    navigate,
    applicationFormId,
    statusOptions,
    filterOptions,
    sortOptions,
  };

  return isMobile ? (
    <MobileApplicantsTab {...props} />
  ) : (
    <DesktopApplicantsTab {...props} />
  );
};

export default ApplicantsTab;
