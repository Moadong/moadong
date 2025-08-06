import { useAdminClubContext } from '@/context/AdminClubContext';
import { Applicant } from '@/types/applicants';
import React from 'react';
import * as Styled from './ApplicantsTab.styles';
import { useNavigate } from 'react-router-dom';

function applicationStatusMapping(status: Applicant['status']): string {
  switch (status) {
    case 'DRAFT':
    case 'SUBMITTED':
    case 'SCREENING':
      return '서류검토';
    case 'SCREENING_PASSED':
    case 'INTERVIEW_SCHEDULED':
    case 'INTERVIEW_IN_PROGRESS':
      return '면접예정';
    case 'INTERVIEW_PASSED':
    case 'OFFERED':
    case 'ACCEPTED':
      return '합격';
    default:
      return '';
  }
}

const ApplicantsTab = () => {
  const navigate = useNavigate();
  const { clubId, applicantsData } = useAdminClubContext();
  if (!clubId) return null;

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
          <Styled.ApplicantFilterSelect>
            <option>전체</option>
          </Styled.ApplicantFilterSelect>
          <Styled.ApplicantFilterSelect>
            <option>제출순</option>
          </Styled.ApplicantFilterSelect>
          <Styled.ApplicantSearchBox placeholder='지원자 이름을 입력해주세요' />
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
            {applicantsData?.applicants.map(
              (item: Applicant, index: number) => (
                <Styled.ApplicantTableRow
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(`/admin/applicants/${item.id}`)
                  }
                >
                  <Styled.ApplicantTableCol>
                    <input
                      type='checkbox'
                      style={{ width: 24, height: 24, borderRadius: 6 }}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                        e.stopPropagation()
                      }
                    />
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>
                    <Styled.ApplicantStatusBadge status={applicationStatusMapping(item.status)}>{applicationStatusMapping(item.status)}</Styled.ApplicantStatusBadge>
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>
                    {item.answers[0].value}
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>
                    {item.memo}
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>
                    {
                      // createdAt을 yyyy-mm-dd 형식으로 변환
                      // 임시로.. 나중에 변경해야함
                      (() => {
                        const date = new Date(item.createdAt);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()
                    }
                  </Styled.ApplicantTableCol>
                </Styled.ApplicantTableRow>
              ),
            )}
          </tbody>
        </Styled.ApplicantTable>
      </Styled.ApplicantListWrapper>
    </>
  );
};

export default ApplicantsTab;
