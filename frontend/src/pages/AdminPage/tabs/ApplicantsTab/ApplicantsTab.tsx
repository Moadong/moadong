import { useAdminClubContext } from '@/context/AdminClubContext';
import { Applicant } from '@/types/applicants';
import React, { useMemo, useState } from 'react';
import * as Styled from './ApplicantsTab.styles';
import { useNavigate } from 'react-router-dom';
import SearchField from '@/components/common/SearchField/SearchField';
import mapStatusToGroup from '@/utils/mapStatusToGroup';

const ApplicantsTab = () => {
  const navigate = useNavigate();
  const { clubId, applicantsData } = useAdminClubContext();
  const [keyword, setKeyword] = useState('');
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
            <Styled.ApplicantFilterSelect>
              <option>전체</option>
            </Styled.ApplicantFilterSelect>
            <Styled.ApplicantFilterSelect>
              <option>제출순</option>
            </Styled.ApplicantFilterSelect>
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
              <Styled.ApplicantTableHeader
                style={{ width: 40 }}
              ></Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader style={{ width: 120 }}>
                현재상태
              </Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader style={{ width: 160 }}>
                이름
              </Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader>메모</Styled.ApplicantTableHeader>
              <Styled.ApplicantTableHeader style={{ width: 140 }}>
                제출날짜
              </Styled.ApplicantTableHeader>
            </Styled.ApplicantTableRow>
          </Styled.ApplicantTableHeaderWrapper>
          <tbody>
            {filteredApplicants.map((item: Applicant, index: number) => (
              <Styled.ApplicantTableRow
                key={index}
                onClick={() => navigate(`/admin/applicants/${item.id}`)}
              >
                <Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCheckbox
                    onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                      e.stopPropagation()
                    }
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
                <Styled.ApplicantTableCol>
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
