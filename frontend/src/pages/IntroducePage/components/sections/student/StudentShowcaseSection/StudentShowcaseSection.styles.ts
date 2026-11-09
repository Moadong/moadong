// 학생 기능 줄 화면 안의 간격, 동아리 태그 줄, 홍보 카드 두 장 스타일
import styled from 'styled-components';
import { ScheduleSection } from '@/pages/ClubDetailPage/components/ClubScheduleCalendar/ClubScheduleCalendar.styles';
import { media } from '@/styles/mediaQuery';

/* 홍보 게시판처럼 포스터 카드를 두 장씩 나란히 둔다 */
export const PromotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

/* 달력은 스스로 회색 바탕을 가져서, 흰 화면 여백을 지우고 바탕이 화면을 꽉 채우게 한다 (틀이 겹겹이 보이지 않게) */
/* 날짜 칸 폭이 정해져 있어 320px대 폰에서는 칸에 맞게 살짝 줄인다 */
export const CalendarFit = styled.div`
  margin: -18px;

  /* 달력 아래 일정 목록은 칸에 다 들어가지 않고 제목만 반쯤 걸려 보여서 뺀다 */
  ${ScheduleSection} {
    display: none;
  }

  ${media.mobile} {
    margin: -12px;
  }

  ${media.mini_mobile} {
    & > * {
      zoom: 0.86;
    }
  }
`;
