import styled, { css } from 'styled-components';

interface MenuItemProps {
  $ActiveMenu?: boolean;
}

interface ExpandButtonProps {
  $isExpanded: boolean;
}


// 전체 레이아웃을 감싸는 컨테이너
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
  line-height: 1.4;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;
// 활성화된 지원서 목록을 감싸는 컨테이너
export const ActiveListContainer = styled.div`
  flex-direction: column;
  width: auto;
  height: auto;
  margin-bottom: 46px;
`;
// "게시된 지원서" 타이틀 박스
export const ActiveListTitleBox= styled.div` 
  width: fit-content; /* 텍스트 크기에 맞게 조절 */
  height: 46px;
  display: flex;
  padding: 12px 24px;
  border: 1px solid #DCDCDC;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #FF7543; 
`;
// "게시된 지원서" 타이틀 텍스트
export const ActiveListTitle = styled.div`
  width: auto;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  white-space: nowrap;
`;
// 펼쳐보기 / 접어두기 버튼
export const ExpandButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #787878;
  border-top: 1px solid #DCDCDC; /* 리스트와 구분하는 선 */
  
  &:hover {
    // background-color: #F2F2F2; /* 호버 시 배경색 변경 물어보기.. */
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;

export const ExpandArrow = styled.img<ExpandButtonProps>`
  width: 19px;
  height: 19px;
  ${(props) => props.$isExpanded && css`
      transform: rotate(180deg); /* 접어두기일때 180도 회전*/
  `}
`;

// 활성화된 지원서가 없을경우 보여주는 메시지 컨테이너
export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  margin-top: 25px;
  margin-bottom: 25px;
`;

export const NoActiveFormsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  padding-top: 2px;
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #FF5414;
`;

export const suggestionText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #787878;
`;

// '새 양식 만들기' 버튼을 포함하는 헤더 영역
export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
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
  font-weight: 500;
  color: #111111;
  cursor: pointer;
  transition: background-color 0.2s;

  // &:hover { /* 새양식 만들기 버튼 호버시 색상 변경할지 물어보기*/
  //   background-color: #F2F2F2;
  // }
`;

export const PlusIcon = styled.img`
  width: 19px; /* 아이콘 너비 */
  height: 19px; /* 아이콘 높이 */
`;

// 학기별 지원서 목록을 감싸는 흰색 카드
export const ApplicationList = styled.div`
  width: auto;
  height: auto;
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #dcdcdc;
  &:not(:last-child) {
    margin-bottom: 20px;
  };
`;

// "2025 2학기", "최종 수정 날짜" 텍스트가 있는 헤더
export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #dcdcdc;
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
`;

export const Separation_Bar = styled.div`
  width: 1px;
  height: 12px;
  margin-right: 25px;
  background-color: #DCDCDC;
`;

export const MenuContainer = styled.div`
  position: absolute; /* MoreButtonContainer를 기준으로 위치 결정 */
  top: 55%; /* 버튼 중앙 바로 아래에 위치 */
  left: 30%; /* 첫번째 점부분에 정렬 */
  width: 150px;
  height: 107px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  z-index: 10;
`;

export const MenuItem = styled.div<MenuItemProps>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 11px;

  font-weight: 400;
  font-size: 14px;

  color: #4b4b4b;
  cursor: pointer;
  box-sizing: border-box; 
  width: auto;
  height: 28px;

  &:hover {
    background-color: #f5f5f5;
  }

  span {
    display: flex;
    align-items: center;
  }
  ${(props) => props.$ActiveMenu && css`
    font-weight: 500;
  `}
`;

export const MenuIcon = styled.img`
  width: 12px; /* 아이콘 너비 */
  height: 12px; /* 아이콘 높이 */
`;
export const Separator = styled.div`
  height: 1px; 
  background-color: #f2f2f2;
  margin: 3px 5px;
`;

