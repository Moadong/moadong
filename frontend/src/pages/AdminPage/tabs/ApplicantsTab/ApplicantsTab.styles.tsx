import styled from "styled-components";

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const PageTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

export const SemesterSelect = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 16px;
`;

// 통계 카드 스타일
export const SummaryWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

export const SummaryCard = styled.div<{ bg: string }>`
  flex: 1;
  background: ${({ bg }) => bg};
  border-radius: 10px;
  padding: 32px 0;
  text-align: center;
`;

export const SummaryLabel = styled.div`
  font-size: 18px;
  color: #888;
`;

export const SummaryValue = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-top: 8px;
  span {
    font-size: 20px;
    font-weight: 400;
    margin-left: 2px;
  }
`;

// 지원자 목록 스타일
export const ApplicantsSection = styled.div``;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

export const FilterSelect = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 16px;
`;

export const SearchInput = styled.input`
  margin-left: auto;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 240px;
  font-size: 16px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

export const Thead = styled.thead`
  background: #fafafa;
`;

export const Th = styled.th`
  padding: 12px 8px;
  font-size: 16px;
  font-weight: 500;
  color: #888;
  text-align: left;
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  &:hover {
    background: #f7faff;
  }
`;

export const Td = styled.td`
  padding: 12px 8px;
  font-size: 16px;
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 500;
  font-size: 15px;
  background: ${({ status }) =>
    status === "서류검토"
      ? "#E6F4FB"
      : status === "면접예정"
      ? "#E6FBF0"
      : status === "합격"
      ? "#F5F5F5"
      : "#eee"};
  color: ${({ status }) => (status === "합격" ? "#888" : "#222")};
`;