import styled, { css } from 'styled-components';

interface MenuItemProps {
  $ActiveMenu?: boolean;
}

interface ExpandButtonProps {
  $isExpanded: boolean;
}

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
    background-color: #f2f2f2;
    &:last-child {
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
`;

// 지원서 제목 (활성화 상태에 따라 스타일 변경)
export const ApplicationTitle = styled.span<{ $active: boolean }>`
  flex-grow: 1; // 남은 공간을 모두 차지하도록 설정
  font-size: 16px;
  color: #4b4b4b;

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
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  &:hover {
    background-color: #dcdcdc;
  }
`;

export const MoreButtonIcon = styled.img`
  width: 12px;
  height: 12px;
`;

export const MoreButtonContainer = styled.div`
  position: relative;
`;
