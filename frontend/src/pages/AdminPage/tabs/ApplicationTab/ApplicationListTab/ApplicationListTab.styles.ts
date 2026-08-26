import styled, { css } from 'styled-components';
import MoreArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

interface ExpandButtonProps {
  $isExpanded: boolean;
}

// 전체 레이아웃을 감싸는 컨테이너
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.4;
`;

// 활성화된 지원서 목록을 감싸는 컨테이너
export const ActiveListContainer = styled.div`
  flex-direction: column;
  width: auto;
  height: auto;
  margin-bottom: 46px;
`;
// "게시된 지원서" 타이틀 박스
export const ActiveListTitleBox = styled.div`
  width: fit-content; /* 텍스트 크기에 맞게 조절 */
  height: 46px;
  display: flex;
  padding: 12px 24px;
  border: 1px solid ${colors.gray[400]};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${colors.primary[800]};
`;
// "게시된 지원서" 타이틀 텍스트
export const ActiveListTitle = styled.div`
  width: auto;
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.base.white};
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
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[700]};
  border-top: 1px solid ${colors.gray[400]}; /* 리스트와 구분하는 선 */

  &:hover {
    background-color: ${colors.gray[200]};
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;

export const ExpandArrow = styled(MoreArrowIcon)<ExpandButtonProps>`
  width: 14px;
  height: 14px;
  ${(props) =>
    props.$isExpanded &&
    css`
      transform: rotate(180deg);
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
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.primary[900]};
`;

export const SuggestionText = styled.div`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
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
  background-color: ${colors.gray[100]};
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.base.black};
  cursor: pointer;
  transition: background-color 0.2s;
`;

export const PlusIcon = styled.img`
  width: 19px; /* 아이콘 너비 */
  height: 19px; /* 아이콘 높이 */
`;

// 학기별 지원서 목록을 감싸는 흰색 카드
export const ApplicationList = styled.div`
  width: auto;
  height: auto;
  background-color: ${colors.base.white};
  border-radius: 20px;
  border: 1px solid ${colors.gray[400]};
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

// "2025 2학기", "최종 수정 날짜" 텍스트가 있는 헤더
export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.gray[400]};
`;

export const SemesterTitle = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.gray[700]};
`;

export const DateHeader = styled.span`
  display: flex;
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[700]};
  margin-right: 35px;
`;

export const Separation_Bar = styled.div`
  width: 1px;
  height: 12px;
  margin-right: 25px;
  background-color: ${colors.gray[400]};
`;
