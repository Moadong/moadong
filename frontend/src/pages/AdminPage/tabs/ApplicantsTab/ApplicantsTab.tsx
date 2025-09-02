import { useAdminClubContext } from '@/context/AdminClubContext';
import { Applicant, ApplicationStatus } from '@/types/applicants';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Styled from './ApplicantsTab.styles';
import { useNavigate } from 'react-router-dom';
import { useDeleteApplicants } from '@/hooks/queries/applicants/useDeleteApplicants';
import SearchField from '@/components/common/SearchField/SearchField';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import selectIcon from '@/assets/images/icons/selectArrow.svg';
import deleteIcon from '@/assets/images/icons/applicant_delete.svg';
import selectAllIcon from '@/assets/images/icons/applicant_select_arrow.svg';
import { useUpdateApplicant } from '@/hooks/queries/applicants/useUpdateApplicant';
import { AVAILABLE_STATUSES } from '@/constants/status';

const ApplicantsTab = () => {
  const navigate = useNavigate();
  const { clubId, applicantsData } = useAdminClubContext();
  const [keyword, setKeyword] = useState('');
  const [checkedItem, setCheckedItem] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { mutate: deleteApplicants } = useDeleteApplicants(clubId!);
  const { mutate: updateDetailApplicants } = useUpdateApplicant(clubId!);
  const allSelectRef = useRef<HTMLDivElement | null>(null);
  const statusSelectRef = useRef<HTMLDivElement | null>(null);

  const filteredApplicants = useMemo(() => {
    if (!applicantsData?.applicants) return [];

    if (!keyword.trim()) return applicantsData.applicants;

    return applicantsData.applicants.filter((user: Applicant) =>
      user.answers[0].value
        .toLowerCase()
        .includes(keyword.trim().toLowerCase()),
    );
  }, [applicantsData, keyword]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        open &&
        allSelectRef.current &&
        !allSelectRef.current.contains(target)
      ) {
        setOpen(false);
      }
      if (
        statusOpen &&
        statusSelectRef.current &&
        !statusSelectRef.current.contains(target)
      ) {
        setStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, statusOpen]);

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

    if (open) setOpen(false);
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
          setStatusOpen(false);
        },
        onError: () => {
          alert('지원자 상태 변경에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  return (
    <>
      <Styled.ApplicationHeader>
        <Styled.ApplicationTitle>지원 현황</Styled.ApplicationTitle>
        {/* <styled.SemesterSelect>
          <option>25년 2학기</option>
          ...다른 학기 */
        /*{' '}
        </styled.SemesterSelect> */}
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
            <Styled.SelectWrapper>
              <Styled.ApplicantFilterSelect>
                <option>전체</option>
              </Styled.ApplicantFilterSelect>
              <Styled.Arrow src={selectIcon} />
            </Styled.SelectWrapper>
            <Styled.SelectWrapper>
              <Styled.ApplicantFilterSelect>
                <option>제출순</option>
              </Styled.ApplicantFilterSelect>
              <Styled.Arrow src={selectIcon} />
            </Styled.SelectWrapper>
            <Styled.VerticalLine />
            <Styled.SelectWrapper
              ref={statusSelectRef}
              onClick={() => {
                if (!isChecked) return;
                setStatusOpen((prev) => !prev);
              }}
            >
              <Styled.StatusSelect disabled={!isChecked}>
                상태변경
              </Styled.StatusSelect>
              <Styled.Arrow width={8} height={8} src={selectIcon} />
              <Styled.StatusSelectMenu open={statusOpen}>
                {AVAILABLE_STATUSES.map((status) => (
                  <Styled.StatusSelectMenuItem
                    onClick={() => {
                      updateAllApplicants(status);
                    }}
                  >
                    {mapStatusToGroup(status).label}
                  </Styled.StatusSelectMenuItem>
                ))}
              </Styled.StatusSelectMenu>
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
                <Styled.ApplicantAllSelectWrapper ref={allSelectRef}>
                  <Styled.ApplicantTableAllSelectCheckbox
                    checked={selectAll}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                      e.stopPropagation();
                      selectApplicantsByStatus('all');
                    }}
                  />
                  <Styled.ApplicantAllSelectArrow
                    src={selectAllIcon}
                    alt='전체선택'
                    onClick={() => setOpen((prev) => !prev)}
                  />
                  <Styled.ApplicantAllSelectMenu open={open}>
                    <Styled.ApplicantAllSelectMenuItem
                      onClick={() => {
                        if (selectAll) {
                          setOpen(false);
                          return;
                        }
                        selectApplicantsByStatus('all');
                      }}
                    >
                      전체선택
                    </Styled.ApplicantAllSelectMenuItem>
                    <Styled.ApplicantAllSelectMenuItem
                      onClick={() => {
                        selectApplicantsByStatus(
                          'filter',
                          ApplicationStatus.SUBMITTED,
                        );
                      }}
                    >
                      서류 검토 필요
                    </Styled.ApplicantAllSelectMenuItem>
                    <Styled.ApplicantAllSelectMenuItem
                      onClick={() => {
                        selectApplicantsByStatus(
                          'filter',
                          ApplicationStatus.INTERVIEW_SCHEDULED,
                        );
                      }}
                    >
                      면접예정
                    </Styled.ApplicantAllSelectMenuItem>
                    <Styled.ApplicantAllSelectMenuItem
                      onClick={() => {
                        setOpen(false);
                        checkoutAllApplicants();
                      }}
                    >
                      선택해제
                    </Styled.ApplicantAllSelectMenuItem>
                  </Styled.ApplicantAllSelectMenu>
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
                onClick={() => navigate(`/admin/applicants/${item.id}`)}
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

export default ApplicantsTab;
