import { useAdminClubContext } from "@/context/AdminClubContext";
import { useGetApplicants } from "@/hooks/queries/applicants/useGetApplicants";
import { Applicant, ApplicantsInfo } from "@/types/applicants";
import React, { useEffect, useState } from "react";
import * as styled from "./ApplicantsTab.styles";
import { useNavigate } from "react-router-dom";

const ApplicantsTab = () => {
  const { clubId, applicantsData } = useAdminClubContext();
  if (!clubId) return null;
  const navigate = useNavigate();

  return (
    <>
      <styled.TopBar>
        <styled.PageTitle>지원 현황</styled.PageTitle>
        {/* <styled.SemesterSelect> */}
          {/* <option>25년 2학기</option> */}
          {/* ...다른 학기 */}
        {/* </styled.SemesterSelect> */}
      </styled.TopBar>

      <styled.SummaryWrapper>
        <styled.SummaryCard bg={"#F5F5F5"}>
          <styled.SummaryLabel>전체 지원자 수</styled.SummaryLabel>
          <styled.SummaryValue>
            {applicantsData?.total}
            <span>명</span>
          </styled.SummaryValue>
        </styled.SummaryCard>
        <styled.SummaryCard bg={"#E6F4FB"}>
          <styled.SummaryLabel>서류 검토 필요</styled.SummaryLabel>
          <styled.SummaryValue>
            {applicantsData?.reviewRequired}
            <span>명</span>
          </styled.SummaryValue>
        </styled.SummaryCard>
        <styled.SummaryCard bg={"#E6FBF0"}>
          <styled.SummaryLabel>면접 예정</styled.SummaryLabel>
          <styled.SummaryValue>
            {applicantsData?.scheduledInterview}
            <span>명</span>
          </styled.SummaryValue>
        </styled.SummaryCard>
        <styled.SummaryCard bg={"#F5F5F5"}>
          <styled.SummaryLabel>합격</styled.SummaryLabel>
          <styled.SummaryValue>
            {applicantsData?.accepted}
            <span>명</span>
          </styled.SummaryValue>
        </styled.SummaryCard>
      </styled.SummaryWrapper>

      <styled.ApplicantsSection>
        <styled.Title>지원자 목록</styled.Title>
        <styled.FilterRow>
          <styled.FilterSelect>
            <option>전체</option>
          </styled.FilterSelect>
          <styled.FilterSelect>
            <option>제출순</option>
          </styled.FilterSelect>
          <styled.SearchInput placeholder="지원자 이름을 입력해주세요" />
        </styled.FilterRow>
        <styled.Table>
          <styled.Thead>
            <styled.Tr>
              <styled.Th style={{ width: 40 }}></styled.Th>
              <styled.Th style={{ width: 120 }}>현재상태</styled.Th>
              <styled.Th style={{ width: 160 }}>이름</styled.Th>
              <styled.Th>메모</styled.Th>
              <styled.Th style={{ width: 140 }}>제출날짜</styled.Th>
            </styled.Tr>
          </styled.Thead>
          <tbody>
            {
              applicantsData?.applicants.map((item: Applicant, index: number) => (
                <styled.Tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/applicants/${item.questionId}`)}
                >
                  <styled.Td>
                    <input
                      type="checkbox"
                      style={{ width: 24, height: 24, borderRadius: 6 }}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                    />
                  </styled.Td>
                  <styled.Td>
                    {/* <styled.StatusBadge status={APPLICATION_STATUS_KR[item.status]}>{APPLICATION_STATUS_KR[item.status]}</styled.StatusBadge> */}
                  </styled.Td>
                  <styled.Td>{item.answers[0].value}</styled.Td>
                  <styled.Td>
                    <p>메모</p>
                  </styled.Td>
                  <styled.Td>날짜</styled.Td>
                </styled.Tr>
              ))
            }
          </tbody>
        </styled.Table>
      </styled.ApplicantsSection>
    </>
  );
};

export default ApplicantsTab;