import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  useDeleteApplicants,
  useUpdateApplicant,
} from '@/hooks/Queries/useApplicants';
import { useGetApplicationList } from '@/hooks/Queries/useApplication';
import {
  ApplicantFilter,
  ApplicantSort,
  useApplicantList,
} from '@/hooks/useApplicantList';
import { useApplicantSelection } from '@/hooks/useApplicantSelection';
import AddItemButton from '@/pages/AdminPage/components/AddItemButton/AddItemButton';
import ApplicantListRow from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/ApplicantListRow/ApplicantListRow';
import ApplicantSearchBox from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/ApplicantSearchBox/ApplicantSearchBox';
import BulkActionBar from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/BulkActionBar/BulkActionBar';
import FormDropdownSelector from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/FormDropdownSelector/FormDropdownSelector';
import SortDropdown from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/SortDropdown/SortDropdown';
import StatusFilterPills from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusFilterPills/StatusFilterPills';
import StatusSummaryCard from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusSummaryCard/StatusSummaryCard';
import { ApplicationStatus } from '@/types/applicants';
import * as Styled from './ApplicantsTabMobile.styles';

type OpenDropdown = 'form' | 'sort' | 'status' | null;

const ApplicantsTabMobile = () => {
  const { applicationFormId: paramFormId } = useParams<{
    applicationFormId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const toggleDropdown = (name: Exclude<OpenDropdown, null>) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  const { data: formsData, isLoading: isFormsLoading } =
    useGetApplicationList();

  const allForms = useMemo(
    () => formsData?.forms?.flatMap((group) => group.forms) ?? [],
    [formsData],
  );

  const effectiveFormId = useMemo(
    () => paramFormId || allForms[0]?.id || '',
    [paramFormId, allForms],
  );

  useEffect(() => {
    if (!paramFormId && effectiveFormId) {
      navigate(`/admin/applicants-list/${effectiveFormId}`, { replace: true });
    }
  }, [paramFormId, effectiveFormId]);

  const sortFromUrl = (searchParams.get('sort') as ApplicantSort) ?? 'date';
  const keywordFromUrl = searchParams.get('q') ?? '';
  const filterFromUrl = useMemo((): ApplicantFilter[] => {
    const raw = searchParams.get('filter');
    return raw ? (raw.split(',') as ApplicantFilter[]) : ['ALL'];
  }, [searchParams]);

  const { checkedIds, toggleId, setCheckedIds, clearSelection } =
    useApplicantSelection(effectiveFormId);

  const {
    applicantsData,
    filteredApplicants,
    isLoading: isApplicantsLoading,
    keyword,
    setKeyword,
    selectedFilter,
    setSelectedFilter,
    selectedSort,
    setSelectedSort,
  } = useApplicantList(effectiveFormId, {
    initialSort: sortFromUrl,
    initialKeyword: keywordFromUrl,
    initialFilter: filterFromUrl,
  });

  const updateSearchParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const handleSortChange = (sort: ApplicantSort) => {
    setSelectedSort(sort);
    updateSearchParam('sort', sort);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    updateSearchParam('q', value || null);
  };

  const handleFilterChange = (filters: ApplicantFilter[]) => {
    setSelectedFilter(filters);
    const isAll = filters.length === 0 || filters.includes('ALL');
    updateSearchParam('filter', isAll ? null : filters.join(','));
  };

  const { mutate: deleteApplicants } = useDeleteApplicants(effectiveFormId);
  const { mutate: updateApplicant } = useUpdateApplicant(effectiveFormId);

  const isAllChecked =
    filteredApplicants.length > 0 &&
    filteredApplicants.every((a) => checkedIds.has(a.id));
  const isAnyChecked = filteredApplicants.some((a) => checkedIds.has(a.id));

  const handleCheckAll = () => {
    if (isAllChecked) {
      clearSelection();
    } else {
      setCheckedIds(new Set(filteredApplicants.map((a) => a.id)));
    }
  };

  const handleFormSelect = (formId: string) => {
    clearSelection();
    navigate(`/admin/applicants-list/${formId}`);
  };

  const handleDelete = () => {
    const ids = filteredApplicants
      .filter((a) => checkedIds.has(a.id))
      .map((a) => a.id);
    if (
      !window.confirm(
        `${ids.length}개의 지원자를 정말로 삭제하시겠습니까?\n삭제된 지원자는 복구할 수 없습니다.`,
      )
    )
      return;
    deleteApplicants(
      { applicantIds: ids },
      {
        onSuccess: () => {
          clearSelection();
          alert('삭제되었습니다.');
        },
        onError: () => {
          alert('지원자 삭제에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    const params = filteredApplicants
      .filter((a) => checkedIds.has(a.id))
      .map((a) => ({ applicantId: a.id, memo: a.memo, status }));
    updateApplicant(params, {
      onSuccess: () => clearSelection(),
      onError: () =>
        alert('지원자 상태 변경에 실패했습니다. 다시 시도해주세요.'),
    });
  };

  const isInitialLoading =
    isFormsLoading || (!!effectiveFormId && isApplicantsLoading);

  return (
    <Styled.Container>
      <WebviewTopBar title='지원자 현황' onBack={() => navigate('/admin')} />
      <Styled.Content>
        {openDropdown !== null && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 5 }}
            onClick={() => setOpenDropdown(null)}
          />
        )}
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <>
            <Styled.TopSection>
              <FormDropdownSelector
                forms={allForms}
                selectedFormId={effectiveFormId}
                onSelect={handleFormSelect}
                isOpen={openDropdown === 'form'}
                onToggle={() => toggleDropdown('form')}
              />
              {applicantsData && <StatusSummaryCard data={applicantsData} />}
            </Styled.TopSection>

            <Styled.SearchSection>
              <Styled.ListTitle>지원자 목록</Styled.ListTitle>
              <ApplicantSearchBox
                value={keyword}
                onChange={handleKeywordChange}
              />
            </Styled.SearchSection>

            <Styled.FilterSection>
              <Styled.FilterPillsWrapper>
                <StatusFilterPills
                  selected={selectedFilter}
                  onChange={handleFilterChange}
                />
              </Styled.FilterPillsWrapper>
              <SortDropdown
                value={selectedSort}
                onChange={handleSortChange}
                isOpen={openDropdown === 'sort'}
                onToggle={() => toggleDropdown('sort')}
              />
            </Styled.FilterSection>

            <Styled.ControlRow>
              <Styled.AllSelectArea onClick={handleCheckAll}>
                <Styled.AllCheckbox $checked={isAllChecked} />
                <Styled.AllSelectLabel>전체선택</Styled.AllSelectLabel>
              </Styled.AllSelectArea>
              <BulkActionBar
                enabled={isAnyChecked}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isStatusMenuOpen={openDropdown === 'status'}
                onToggleStatusMenu={() => toggleDropdown('status')}
              />
            </Styled.ControlRow>

            <Styled.List>
              {isApplicantsLoading ? (
                <Spinner />
              ) : filteredApplicants.length === 0 ? (
                <Styled.EmptyState>
                  <Styled.EmptyLabel>
                    모아동 지원서를 등록해주세요
                  </Styled.EmptyLabel>
                  <AddItemButton
                    onClick={() => navigate('/admin/application-list/edit')}
                  >
                    모아동 지원서 만들기
                  </AddItemButton>
                </Styled.EmptyState>
              ) : (
                filteredApplicants.map((applicant) => (
                  <ApplicantListRow
                    key={applicant.id}
                    applicant={applicant}
                    isChecked={checkedIds.has(applicant.id)}
                    onCheck={toggleId}
                    onClick={() =>
                      navigate(
                        `/admin/applicants-list/${effectiveFormId}/${applicant.id}`,
                      )
                    }
                  />
                ))
              )}
            </Styled.List>
          </>
        )}
      </Styled.Content>
    </Styled.Container>
  );
};

export default ApplicantsTabMobile;
