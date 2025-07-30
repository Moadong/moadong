import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetApplicants } from '@/hooks/queries/applicants/useGetApplicants';
import { Applicant, ApplicantsInfo } from '@/types/applicants';
import React, { useEffect, useState } from 'react';
import * as Styled from './ApplicantsTab.styles';
import { useNavigate } from 'react-router-dom';

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
                    navigate(`/admin/applicants/${item.questionId}`)
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
                    {/* <styled.StatusBadge status={APPLICATION_STATUS_KR[item.status]}>{APPLICATION_STATUS_KR[item.status]}</styled.StatusBadge> */}
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>
                    {item.answers[0].value}
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>
                    <p>메모</p>
                  </Styled.ApplicantTableCol>
                  <Styled.ApplicantTableCol>날짜</Styled.ApplicantTableCol>
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
