import { useAdminClubContext } from '@/context/AdminClubContext';
import { Applicant } from '@/types/applicants';
import React, { useEffect, useMemo, useState } from 'react';
import * as Styled from './ApplicantsTab.styles';
import { useNavigate } from 'react-router-dom';
import SearchField from '@/components/common/SearchField/SearchField';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import selectIcon from '@/assets/images/icons/selectArrow.svg';
import deleteIcon from '@/assets/images/icons/applicant_delete.svg';
import { useDeleteApplicants } from '@/hooks/queries/applicants/useDeleteApplicants';

const ApplicantsTab = () => {
  const navigate = useNavigate();
  const { clubId, applicantsData } = useAdminClubContext();
  const [keyword, setKeyword] = useState('');
  const [checkedItem, setCheckedItem] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const { mutate: deleteApplicants } = useDeleteApplicants(clubId!);
  if (!clubId) return null;

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
    const newMap = new Map<string, boolean>();
    filteredApplicants.forEach((user: Applicant) => {
      newMap.set(user.id, false);
    });
    setCheckedItem(newMap);
  }, [filteredApplicants]);

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
          setSelectAll(false);
          setCheckedItem(new Map());
          alert('삭제되었습니다.');
        },
        onError: () => {
          alert('지원자 삭제에 실패했습니다. 다시 시도해주세요.');
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
            <Styled.SelectWrapper>
              <Styled.StatusSelect
                disabled={Array.from(checkedItem.values()).some((v) => v)}
              >
                <option value='상태변경'>상태변경</option>
              </Styled.StatusSelect>
              <Styled.Arrow width={8} height={8} src={selectIcon} />
            </Styled.SelectWrapper>
            <Styled.DeleteButton
              src={deleteIcon}
              alt='삭제'
              disabled={Array.from(checkedItem.values()).some((v) => v)}
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
              <Styled.ApplicantTableHeader width={40}>
                <Styled.ApplicantTableAllSelectCheckbox
                  checked={selectAll}
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.stopPropagation();

                    if (checkedItem.size === 0) return;

                    setSelectAll((prev) => {
                      const newSelect = !prev;

                      setCheckedItem((prev) => {
                        const newMap = new Map(prev);
                        newMap.forEach((_, key) => {
                          newMap.set(key, newSelect);
                        });
                        return newMap;
                      });

                      return newSelect;
                    });
                  }}
                />
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
