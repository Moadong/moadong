import React from 'react';
import * as Styled from './ApplicantsTab.styles';
import { Applicant, ApplicationStatus } from '@/types/applicants';
import SearchField from '@/components/common/SearchField/SearchField';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import selectIcon from '@/assets/images/icons/selectArrow.svg';
import deleteIcon from '@/assets/images/icons/applicant_delete.svg';
import selectAllIcon from '@/assets/images/icons/applicant_select_arrow.svg';
import { CustomDropDown } from '@/components/common/CustomDropDown/CustomDropDown';
import { NavigateFunction } from 'react-router-dom';

interface ApplicantsTabProps {
  applicantsData: any;
  filteredApplicants: Applicant[];
  keyword: string;
  setKeyword: (keyword: string) => void;
  checkedItem: Map<string, boolean>;
  setCheckedItem: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
  selectAll: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  isStatusDropdownOpen: boolean;
  setIsStatusDropdownOpen: (open: boolean) => void;
  isChecked: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  isSortOpen: boolean;
  setIsSortOpen: (open: boolean) => void;
  selectedSort: { value: 'date' | 'name'; label: string };
  setSelectedSort: (sort: { value: 'date' | 'name'; label: string }) => void;
  closeAllDropdowns: () => void;
  dropdownRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  deleteSelectApplicants: (ids: string[]) => void;
  selectApplicantsByStatus: (
    mode: 'all' | 'filter',
    ...args: ApplicationStatus[]
  ) => void;
  updateAllApplicants: (status: ApplicationStatus) => void;
  navigate: NavigateFunction;
  applicationFormId: string | null;
  statusOptions: { value: ApplicationStatus; label: string }[];
  filterOptions: { value: string; label: string }[];
  sortOptions: { value: 'date' | 'name'; label: string }[];
}

const MobileApplicantsTab = ({
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
}: ApplicantsTabProps) => {
  return (
    <>
      <Styled.ApplicationHeader>
        <Styled.ApplicationTitle>지원 현황</Styled.ApplicationTitle>
      </Styled.ApplicationHeader>

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
                  setSelectedFilter(value);
                }}
                open={isFilterOpen}
                onToggle={(isOpen) => {
                  closeAllDropdowns();
                  setIsFilterOpen(!isOpen);
                }}
                selected={selectedFilter}
                style={{ width: '101px' }}
              >
                <CustomDropDown.Trigger>
                  <Styled.ApplicantFilterSelect>
                    {
                      filterOptions.find(
                        (option) => option.value === selectedFilter,
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
                  const selected = sortOptions.find(
                    (option) => option.value === value,
                  );
                  if (selected) {
                    setSelectedSort(selected);
                  }
                }}
                open={isSortOpen}
                selected={selectedSort.value}
                onToggle={(isOpen) => {
                  closeAllDropdowns();
                  setIsSortOpen(!isOpen);
                }}
                style={{ width: '101px' }}
              >
                <CustomDropDown.Trigger>
                  <Styled.ApplicantFilterSelect>
                    {selectedSort.label}
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
                const toBeDeleted = Array.from(checkedItem.entries())
                  .filter(([_, isChecked]) => isChecked)
                  .map(([id, _]) => id);

                deleteSelectApplicants(toBeDeleted);
              }}
            />
          </Styled.FilterContainer>
          <SearchField
            value={keyword}
            onChange={setKeyword}
            onSubmit={() => {}}
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
                    checked={checkedItem.get(item.id)}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                      e.stopPropagation();
                      setCheckedItem((prev) => {
                        const newMap = new Map(prev);
                        newMap.set(item.id, !newMap.get(item.id));
                        return newMap;
                      });
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

export default MobileApplicantsTab;
