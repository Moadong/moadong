// 실시간 반영 데모의 관리자 입력 화면(저장 버튼 포함)과 학생 화면 카드 스타일
import styled, { keyframes } from 'styled-components';
import * as CardStyled from '@/pages/ClubDetailPage/components/ClubProfileCard/ClubProfileCard.styles';
import { colors } from '@/styles/theme/colors';

export const Root = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
`;

/* 두 화면이 화면 칸 높이에 들어오도록 살짝 줄인다. 커서는 바깥(Root)에 있어 좌표가 어긋나지 않는다 */
export const Fit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  zoom: 0.86;
`;

export const Screen = styled.div<{ $highlight?: boolean }>`
  position: relative;
  padding: 12px 14px 14px;
  border-radius: 18px;
  background: ${colors.base.white};
  box-shadow:
    0 0 0 ${({ $highlight }) => ($highlight ? 2 : 1)}px
      ${({ $highlight }) =>
        $highlight ? colors.primary[700] : colors.gray[300]},
    0 10px 28px rgba(17, 17, 17, 0.06);
  transition: box-shadow 0.4s ease;
`;

export const ScreenLabel = styled.span`
  display: inline-block;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${colors.gray[100]};
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray[700]};
`;

export const FieldLabel = styled.p`
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.gray[900]};
`;

/* 두 줄 높이를 미리 잡아 글자가 늘어나도 화면이 흔들리지 않는다 */
export const Input = styled.div<{ $focused: boolean }>`
  height: 66px;
  padding: 10px 14px;
  border: 1.5px solid
    ${({ $focused }) => ($focused ? colors.primary[900] : colors.gray[300])};
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.gray[950]};
  word-break: keep-all;
  overflow: hidden;
  transition: border-color 0.2s ease;
`;

const blink = keyframes`
  50% { opacity: 0; }
`;

export const Caret = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: ${colors.primary[900]};
  animation: ${blink} 1s steps(1) infinite;
`;

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const SaveButton = styled.button`
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: ${colors.primary[900]};
  font-size: 14px;
  font-weight: 700;
  color: ${colors.base.white};
`;

/* 실제 동아리 카드를 쓰되, 데모 칸이 좁아 커버와 로고는 빼고 이름·상태·소개만 보여 준다 */
export const StudentCard = styled.div`
  ${CardStyled.CoverImageWrapper}, ${CardStyled.LogoWrapper} {
    display: none;
  }

  ${CardStyled.Content} {
    margin-top: 0;
    padding-top: 18px;
  }
`;
