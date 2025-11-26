import styled, { css } from 'styled-components';

// 전체 레이아웃을 감싸는 컨테이너
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  line-height: 1.4;
`;

export const Title = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 24px;
`;

// '새 양식 만들기' 버튼을 포함하는 헤더 영역
export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

// '새 양식 만들기' 버튼
export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
  }
`;

export const PlusIcon = styled.img`
  width: 19px; /* 아이콘 너비 */
  height: 19px; /* 아이콘 높이 */
`;

// 학기별 지원서 목록을 감싸는 흰색 카드
export const ApplicationList = styled.div`
  width: 857px;
  height: auto;
  background-color: #ffffff;
  border-radius: 14px;
  border: 1px solid #dcdcdc;
  margin-bottom: 14px;
  gap: 14px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// "2025 2학기", "최종 수정 날짜" 텍스트가 있는 헤더
export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #dcdcdc;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const SemesterTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #787878;
`;

export const DateHeader = styled.span`
  display: flex;
  font-size: 12px;
  color: #787878;
  margin-right: 35px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

export const Separation_Bar = styled.div`
  width: 1px; /* 아이콘 너비 */
  height: 12px; /* 아이콘 높이 */
  margin-right: 25px;
  background-color: #dcdcdc;
`;

// 개별 지원서 한 줄 (Row)
export const ApplicationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 18px 24px;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f2f2f2;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
    &:last-child {
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    height: auto;
  }
`;

// 지원서 제목 (활성화 상태에 따라 스타일 변경)
export const ApplicationTitle = styled.span<{ $active: boolean }>`
  flex-grow: 1; // 남은 공간을 모두 차지하도록 설정
  font-size: 16px;
  color: #4b3b4b;

  // active prop이 true일 때 적용될 스타일
  ${(props) =>
    props.$active &&
    css`
      color: #ff5414;
      font-weight: 600;
      position: relative;
      padding-left: 16px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background-color: #ff5414;
        border-radius: 50%;
      }
    `}
`;

export const ApplicationDatetable = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// 수정 날짜
export const ApplicationDate = styled.span`
  width: auto;
  text-align: right;
  font-size: 16px;
  color: #4b4b4b;
`;

// 더보기(...) 버튼
export const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #adb5bd;
  cursor: pointer;
  padding: 0 8px;
`;

export const MoreButtonIcon = styled.img`
  svg {
    width: 12px; /* 아이콘 너비 */
    height: 12px; /* 아이콘 높이 */
  }
`;

export const MoreButtonContainer = styled.div`
  position: relative;
`;

export const MenuContainer = styled.div`
  position: absolute; /* MoreButtonContainer를 기준으로 위치 결정 */
  top: 100%; /* 버튼 바로 아래에 위치 */
  left: 0; /* 오른쪽에 정렬 */
  margin-top: 8px; /* 버튼과의 간격 */
  width: 150px;
  height: 107px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #f1f3f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 10;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 11px;

  font-weight: 600;
  font-size: 12px;
  line-height: 1.4; /* 140% */
  letter-spacing: -0.02em; /* -2% */

  color: #343a40; /* 텍스트 색상을 지정합니다 (추천) */
  cursor: pointer;
  box-sizing: border-box; /* 패딩을 포함하여 너비 계산 */
  width: 100%;
  height: 28px;

  &:hover {
    background-color: #f5f5f5;
  }

  /* 아이콘(span)과 텍스트의 정렬을 위한 추가 스타일 */
  span {
    display: flex;
    align-items: center;
  }
`;

export const MenuIcon = styled.img`
  width: 12px; /* 아이콘 너비 */
  height: 12px; /* 아이콘 높이 */
`;
export const Separator = styled.div`
  height: 1px; /* 선의 두께 */
  background-color: #f0f0f0; /* 선의 색상 */
  margin: 3px 5px; /* 위아래 여백 4px, 좌우 여백 12px */
`;
