import { useAdminClubContext } from "@/context/AdminClubContext";
import { useGetApplicants } from "@/hooks/queries/applicants/useGetApplicants";
import { Applicant, ApplicantsInfo, APPLICATION_STATUS_KR } from "@/types/applicants";
import React, { useEffect, useState } from "react";
import { ApplicantsSection, FilterRow, FilterSelect, PageTitle, SearchInput, StatusBadge, SummaryCard, SummaryContainer, SummaryLabel, SummaryValue, Table, Td, Th, Thead, Title, TopBar, Tr } from "./ApplicantsTab.styles";

const ApplicantsTab = () => {
  const { clubId } = useAdminClubContext();
  if (!clubId) return null;

  const { data, isLoading, isError } = useGetApplicants(clubId);
  const [applicantsData, setApplicantsData] = useState<ApplicantsInfo>();

  useEffect(() => {
    if (data) {
      setApplicantsData(data);
    }
  }, [data]);

  return (
    <>
      {/* 상단 타이틀/학기선택 */}
      <TopBar>
        <PageTitle>지원 현황</PageTitle>
        {/* <SemesterSelect> */}
          {/* <option>25년 2학기</option> */}
          {/* ...다른 학기 */}
        {/* </SemesterSelect> */}
      </TopBar>

      {/* 통계 카드 */}
      <SummaryContainer>
        <SummaryCard bg={"#F5F5F5"}>
          <SummaryLabel>전체 지원자 수</SummaryLabel>
          <SummaryValue>
            {applicantsData?.total}
            <span>명</span>
          </SummaryValue>
        </SummaryCard>
        <SummaryCard bg={"#E6F4FB"}>
          <SummaryLabel>서류 검토 필요</SummaryLabel>
          <SummaryValue>
            {applicantsData?.reviewRequired}
            <span>명</span>
          </SummaryValue>
        </SummaryCard>
        <SummaryCard bg={"#E6FBF0"}>
          <SummaryLabel>면접 예정</SummaryLabel>
          <SummaryValue>
            {applicantsData?.scheduledInterview}
            <span>명</span>
          </SummaryValue>
        </SummaryCard>
        <SummaryCard bg={"#F5F5F5"}>
          <SummaryLabel>합격</SummaryLabel>
          <SummaryValue>
            {applicantsData?.accepted}
            <span>명</span>
          </SummaryValue>
        </SummaryCard>
      </SummaryContainer>

      {/* 지원자 목록 */}
      <ApplicantsSection>
        <Title>지원자 목록</Title>
        <FilterRow>
          <FilterSelect>
            <option>전체</option>
          </FilterSelect>
          <FilterSelect>
            <option>제출순</option>
          </FilterSelect>
          <SearchInput placeholder="지원자 이름을 입력해주세요" />
        </FilterRow>
        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: 40 }}></Th>
              <Th style={{ width: 120 }}>현재상태</Th>
              <Th style={{ width: 160 }}>이름</Th>
              <Th>메모</Th>
              <Th style={{ width: 140 }}>제출날짜</Th>
            </Tr>
          </Thead>
          <tbody>
            {
              applicantsData?.applicants.map((item: Applicant, index: number) => (
                <Tr key={index}>
                  <Td>
                    <input type="checkbox" />
                  </Td>
                  <Td>
                    <StatusBadge status={APPLICATION_STATUS_KR[item.status]}>{APPLICATION_STATUS_KR[item.status]}</StatusBadge>
                  </Td>
                  <Td>{item.answers[0].value}</Td>
                  <Td>
                    <p>메모</p>
                  </Td>
                  <Td>날짜</Td>
                </Tr>
              ))
            }
          </tbody>
        </Table>
      </ApplicantsSection>
    </>
  );
};

export default ApplicantsTab;