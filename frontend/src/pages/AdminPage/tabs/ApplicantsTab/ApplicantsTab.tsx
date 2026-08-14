import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import deleteIcon from '@/assets/images/icons/applicant_delete.svg';
import selectAllIcon from '@/assets/images/icons/applicant_select_arrow.svg';
import selectIcon from '@/assets/images/icons/selectArrow.svg';
import { CustomDropDown } from '@/components/common/CustomDropDown/CustomDropDown';
import SearchField from '@/components/common/SearchField/SearchField';
import { AVAILABLE_STATUSES } from '@/constants/status';
import {
  useDeleteApplicants,
  useUpdateApplicant,
} from '@/hooks/Queries/useApplicants';
import {
  ApplicantFilter,
  ApplicantSort,
  useApplicantList,
} from '@/hooks/useApplicantList';
import { useApplicantSelection } from '@/hooks/useApplicantSelection';
import useDevice from '@/hooks/useDevice';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { Applicant, ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './ApplicantsTab.styles';
import ApplicantsTabMobile from './ApplicantsTabMobile';

const sortOptions = [
  { value: 'date', label: '제출순' },
  { value: 'name', label: '이름순' },
] as const;

const ApplicantsTab = () => {
  const { isMobile, isTablet } = useDevice();

  if (isMobile || isTablet) {
    return <ApplicantsTabMobile />;
  }

  return <ApplicantsTabDesktop />;
};

const ApplicantsTabDesktop = () => {
  const { applicationFormId } = useParams<{ applicationFormId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const sortParam = (searchParams.get('sort') as ApplicantSort) ?? 'date';
  const keywordParam = searchParams.get('q') ?? '';
  const filterParam = searchParams.get('filter');
  // 모바일에서 복수 선택(콤마 구분) 넘어오면 단일 표현 불가 → ALL로 리셋
  const initialFilter =
    filterParam && !filterParam.includes(',') ? filterParam : 'ALL';

  const [open, setOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const {
    applicantsData,
    filteredApplicants,
    selectedSort,
    setSelectedSort,
    keyword,
    setKeyword,
    selectedFilter,
    setSelectedFilter,
  } = useApplicantList(applicationFormId, {
    initialSort: sortParam,
    initialKeyword: keywordParam,
    initialFilter: [initialFilter as ApplicantFilter],
  });

  const currentFilter = selectedFilter[0] ?? 'ALL';
  const selectedSortOption =
    sortOptions.find((o) => o.value === selectedSort) ?? sortOptions[0];

  const handleFilterChange = (value: string) => {
    setSelectedFilter([value as ApplicantFilter]);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'ALL') next.delete('filter');
        else next.set('filter', value);
        return next;
      },
      { replace: true },
    );
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('q', value);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value as ApplicantSort);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('sort', value);
        return next;
      },
      { replace: true },
    );
  };

  const closeAllDropdowns = () => {
    if (open) setOpen(false);
    if (isStatusDropdownOpen) setIsStatusDropdownOpen(false);
    if (isFilterOpen) setIsFilterOpen(false);
    if (isSortOpen) setIsSortOpen(false);
  };

  const { mutate: deleteApplicants } = useDeleteApplicants(
    applicationFormId ?? '',
  );
  const { mutate: updateDetailApplicants } =
    useUpdateApplicant(applicationFormId);
  const dropdownRef = useRef<Array<HTMLDivElement | null>>([]);

  const {
    checkedIds,
    toggleId: onToggleId,
    setCheckedIds: onSetCheckedIds,
    clearSelection: onClearSelection,
  } = useApplicantSelection(applicationFormId ?? '');

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

  const selectAll =
    filteredApplicants.length > 0 &&
    filteredApplicants.every((a) => checkedIds.has(a.id));
  const isChecked = filteredApplicants.some((a) => checkedIds.has(a.id));

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
          onClearSelection();
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
    if (filteredApplicants.length === 0) return;

    if (mode === 'all') {
      if (selectAll) {
        onClearSelection();
      } else {
        onSetCheckedIds(new Set(filteredApplicants.map((a) => a.id)));
      }
      return;
    }

    const byStatus = new Set(
      filteredApplicants
        .filter((a) => args.includes(a.status))
        .map((a) => a.id),
    );
    onSetCheckedIds(byStatus);
  };

  const updateAllApplicants = (status: ApplicationStatus) => {
    updateDetailApplicants(
      (applicantsData?.applicants ?? [])
        .filter((applicant) => checkedIds.has(applicant.id))
        .map((applicant) => ({
          applicantId: applicant.id,
          memo: applicant.memo,
          status: status,
        })),
      {
        onSuccess: () => {
          onClearSelection();
        },
        onError: () => {
          alert('지원자 상태 변경에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <ContentSection.Header title='지원 현황' />
      </div>

      <Styled.SummaryWrapper>
        <Styled.SummaryCard bgColor={'#F5F5F5'}>
          <Styled.SummaryLabel>전체 지원자 수</Styled.SummaryLabel>
          <Styled.SummaryValue>
            {applicantsData?.total}
            <Styled.SummaryPeople>명</Styled.SummaryPeople>
          </Styled.SummaryValue>
        </Styled.SummaryCard>
        <Styled.SummaryCard bgColor={'#E6F4FB'}>
          <Styled.SummaryLabel>서류 검토 필요</Styled.SummaryLabel>
          <Styled.SummaryValue>
            {applicantsData?.reviewRequired}
            <Styled.SummaryPeople>명</Styled.SummaryPeople>
          </Styled.SummaryValue>
        </Styled.SummaryCard>
        <Styled.SummaryCard bgColor={'#E6FBF0'}>
          <Styled.SummaryLabel>면접 예정</Styled.SummaryLabel>
          <Styled.SummaryValue>
            {applicantsData?.scheduledInterview}
            <Styled.SummaryPeople>명</Styled.SummaryPeople>
          </Styled.SummaryValue>
        </Styled.SummaryCard>
        <Styled.SummaryCard bgColor={'#F5F5F5'}>
          <Styled.SummaryLabel>합격</Styled.SummaryLabel>
          <Styled.SummaryValue>
            {applicantsData?.accepted}
            <Styled.SummaryPeople>명</Styled.SummaryPeople>
          </Styled.SummaryValue>
        </Styled.SummaryCard>
      </Styled.SummaryWrapper>

      <Styled.ApplicantListWrapper>
        <Styled.ApplicantListTitle>지원자 목록</Styled.ApplicantListTitle>
        <Styled.ApplicantListHeader>
          <Styled.FilterContainer>
            <Styled.SelectWrapper
              ref={(el) => {
                dropdownRef.current[2] = el;
              }}
            >
              <CustomDropDown
                options={filterOptions}
                onSelect={(value) => {
                  handleFilterChange(value);
                }}
                open={isFilterOpen}
                onToggle={(isOpen) => {
                  closeAllDropdowns();
                  setIsFilterOpen(!isOpen);
                }}
                selected={currentFilter}
                style={{ width: '101px' }}
              >
                <CustomDropDown.Trigger>
                  <Styled.ApplicantFilterSelect>
                    {
                      filterOptions.find(
                        (option) => option.value === currentFilter,
                      )?.label
                    }
                  </Styled.ApplicantFilterSelect>
                  <Styled.Arrow src={selectIcon} />
                </CustomDropDown.Trigger>
                <CustomDropDown.Menu top='115%'>
                  {filterOptions.map(({ value, label }) => (
                    <CustomDropDown.Item
                      key={value}
                      value={value}
                      style={{ fontSize: '12px' }}
                    >
                      {label}
                    </CustomDropDown.Item>
                  ))}
                </CustomDropDown.Menu>
              </CustomDropDown>
            </Styled.SelectWrapper>
            <Styled.SelectWrapper
              ref={(el) => {
                dropdownRef.current[3] = el;
              }}
            >
              <CustomDropDown
                options={sortOptions}
                onSelect={(value) => {
                  handleSortChange(value);
                }}
                open={isSortOpen}
                selected={selectedSortOption.value}
                onToggle={(isOpen) => {
                  closeAllDropdowns();
                  setIsSortOpen(!isOpen);
                }}
                style={{ width: '101px' }}
              >
                <CustomDropDown.Trigger>
                  <Styled.ApplicantFilterSelect>
                    {selectedSortOption.label}
                  </Styled.ApplicantFilterSelect>
                  <Styled.Arrow src={selectIcon} />
                </CustomDropDown.Trigger>
                <CustomDropDown.Menu top='115%'>
                  {sortOptions.map(({ value, label }) => (
                    <CustomDropDown.Item
                      key={value}
                      value={value}
                      style={{ fontSize: '12px' }}
                    >
                      {label}
                    </CustomDropDown.Item>
                  ))}
                </CustomDropDown.Menu>
              </CustomDropDown>
            </Styled.SelectWrapper>
            <Styled.VerticalLine />
            <Styled.SelectWrapper
              ref={(el) => {
                dropdownRef.current[0] = el;
              }}
            >
              <CustomDropDown
                options={statusOptions}
                onSelect={(status) =>
                  updateAllApplicants(status as ApplicationStatus)
                }
                open={isStatusDropdownOpen}
                onToggle={(isOpen) => {
                  if (!isChecked) return;
                  closeAllDropdowns();
                  setIsStatusDropdownOpen(!isOpen);
                }}
              >
                <CustomDropDown.Trigger>
                  <Styled.StatusSelect disabled={!isChecked}>
                    상태변경
                  </Styled.StatusSelect>
                  <Styled.Arrow width={8} height={8} src={selectIcon} />
                </CustomDropDown.Trigger>
                <CustomDropDown.Menu>
                  {statusOptions.map(({ value, label }) => (
                    <CustomDropDown.Item
                      key={value}
                      value={value}
                      style={{ fontSize: '12px' }}
                    >
                      {label}
                    </CustomDropDown.Item>
                  ))}
                </CustomDropDown.Menu>
              </CustomDropDown>
            </Styled.SelectWrapper>
            <Styled.DeleteButton
              src={deleteIcon}
              alt='삭제'
              disabled={!isChecked}
              onClick={() => {
                const toBeDeleted = filteredApplicants
                  .filter((a) => checkedIds.has(a.id))
                  .map((a) => a.id);
                deleteSelectApplicants(toBeDeleted);
              }}
            />
          </Styled.FilterContainer>
          <SearchField
            value={keyword}
            onChange={handleKeywordChange}
            autoBlur={false}
            placeholder='지원자 이름을 입력해주세요'
            ariaLabel='지원자 검색창'
          />
        </Styled.ApplicantListHeader>
        <Styled.ApplicantTable>
          <Styled.ApplicantTableHeaderWrapper>
            <Styled.ApplicantTableRow>
              <Styled.ApplicantTableHeader width={55}>
                <Styled.ApplicantAllSelectWrapper
                  ref={(el) => {
                    dropdownRef.current[1] = el;
                  }}
                >
                  <Styled.ApplicantTableAllSelectCheckbox
                    checked={selectAll}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                      e.stopPropagation();
                      selectApplicantsByStatus('all');
                    }}
                  />
                  <CustomDropDown
                    options={filterOptions}
                    onSelect={(status) => {
                      if (status === 'ALL') {
                        selectApplicantsByStatus('all');
                      } else {
                        selectApplicantsByStatus(
                          'filter',
                          status as ApplicationStatus,
                        );
                      }
                    }}
                    onToggle={(isOpen) => {
                      closeAllDropdowns();
                      setOpen(!isOpen);
                    }}
                    open={open}
                    style={{ width: '0' }}
                  >
                    <CustomDropDown.Trigger>
                      <Styled.ApplicantAllSelectArrow
                        src={selectAllIcon}
                        alt='전체선택'
                      />
                    </CustomDropDown.Trigger>
                    <CustomDropDown.Menu top='16px' width='110px' right='-84px'>
                      {filterOptions.map(({ value, label }) => (
                        <CustomDropDown.Item
                          key={value}
                          value={value}
                          style={{ justifyContent: 'flex-start' }}
                        >
                          {label}
                        </CustomDropDown.Item>
                      ))}
                    </CustomDropDown.Menu>
                  </CustomDropDown>
                </Styled.ApplicantAllSelectWrapper>
              </Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader width={120}>
                현재상태
              </Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader width={80} borderLeft={true}>
                이름
              </Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader borderLeft={true} isMemo={true}>
                메모
              </Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader width={140} borderLeft={true}>
                제출날짜
              </Styled.ApplicantTableHeader>
            </Styled.ApplicantTableRow>
          </Styled.ApplicantTableHeaderWrapper>
          <tbody>
            {filteredApplicants.map((item: Applicant, index: number) => (
              <Styled.ApplicantTableRow
                key={index}
                onClick={() =>
                  navigate(
                    `/admin/applicants-list/${applicationFormId}/${item.id}`,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCheckbox
                    checked={checkedIds.has(item.id)}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                      e.stopPropagation();
                      onToggleId(item.id);
                    }}
                  />
                </Styled.ApplicantTableCol>
                <Styled.ApplicantTableCol>
                  <Styled.ApplicantStatusBadge
                    status={mapStatusToGroup(item.status).label}
                  >
                    {mapStatusToGroup(item.status).label}
                  </Styled.ApplicantStatusBadge>
                </Styled.ApplicantTableCol>
                <Styled.ApplicantTableCol>
                  {item.answers[0].value}
                </Styled.ApplicantTableCol>
                <Styled.ApplicantTableCol isMemo={true}>
                  {item.memo && item.memo.length > 0 ? (
                    item.memo
                  ) : (
                    <span style={{ color: '#989898' }}>
                      메모를 입력하지 않았습니다.
                    </span>
                  )}
                </Styled.ApplicantTableCol>
                <Styled.ApplicantTableCol>
                  {
                    // createdAt을 yyyy-mm-dd 형식으로 변환
                    // 임시로.. 나중에 변경해야함
                    (() => {
                      const date = new Date(item.createdAt);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        '0',
                      );
                      const day = String(date.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })()
                  }
                </Styled.ApplicantTableCol>
              </Styled.ApplicantTableRow>
            ))}
          </tbody>
        </Styled.ApplicantTable>
      </Styled.ApplicantListWrapper>
    </>
  );
};

export default ApplicantsTab;
