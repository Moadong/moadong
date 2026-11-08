// 운영진에게 실제 관리자 화면 컴포넌트(지원자·지원서·동아리 페이지·일정·홍보·통계)를 목업 데이터로 한 줄씩 보여주는 섹션
import PromotionCardView from '@/components/promotion/PromotionCardView/PromotionCardView';
import CalendarBoard from '@/pages/AdminPage/tabs/CalendarSyncTab/components/CalendarBoard/CalendarBoard';
import MetricSummary from '@/pages/AdminPage/tabs/StatisticsTab/components/MetricSummary';
import TrendChart from '@/pages/AdminPage/tabs/StatisticsTab/components/TrendChart';
import FeatureRow from '@/pages/IntroducePage/components/FeatureRow/FeatureRow';
import {
  List,
  ListHeading,
  ListHeadingBrand,
} from '@/pages/IntroducePage/components/FeatureRow/FeatureRow.styles';
import {
  MOCK_CALENDAR_EVENTS,
  MOCK_PROMOTION,
  MOCK_STATISTICS_OVERVIEW,
  MOCK_STATISTICS_TREND,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import AiDraftDemo from '../demos/AiDraftDemo';
import ApplicantsDemo from '../demos/ApplicantsDemo';
import LiveEditDemo from '../demos/LiveEditDemo';
import * as Styled from './ClubShowcaseSection.styles';

const noop = () => {};
/** 목업은 오류 상태가 없어 다시 시도가 불리지 않는다 */
const neverRetry = () => new Promise<never>(noop);

const ClubShowcaseSection = () => {
  return (
    <List aria-label='관리자 페이지 기능 소개'>
      {/* 단톡방 마지막 메시지에 바로 답하는 제목 */}
      <ListHeading>
        이제 반복하지 마세요
        <br />
        <ListHeadingBrand>모아동</ListHeadingBrand>이 대신할게요
      </ListHeading>

      <FeatureRow
        title={'서류부터 합격까지\n지원자를 한 화면에서'}
        caption='지원자마다 서류검토·면접예정·합격·불합격을 표시하고, 여러 명을 한 번에 바꿀 수 있어요.'
        link={{ label: '지원자 관리하기', to: '/admin/applicants-list' }}
      >
        <ApplicantsDemo />
      </FeatureRow>

      <FeatureRow
        reverse
        title={'지원서 질문 고민은\nAI에게 맡기세요'}
        caption='우리 동아리 정보를 읽고, 바로 쓸 수 있는 지원서를 만들어줘요.'
        link={{ label: '지원서 만들기', to: '/admin/application-list' }}
      >
        <AiDraftDemo />
      </FeatureRow>

      <FeatureRow
        title={'동아리 소개를 고치면\n학생 화면에 바로 보여요'}
        caption='저장 한 번이면 끝. 바뀐 내용을 알리려고 에타에 수정 공지를 다시 올릴 필요 없어요.'
        link={{ label: '동아리 정보 수정하기', to: '/admin/club-info' }}
        bare
      >
        <LiveEditDemo />
      </FeatureRow>

      <FeatureRow
        reverse
        title={'쓰던 캘린더를 연결하면\n동아리 일정이 그대로 보여요'}
        caption='Google·Notion 캘린더를 연결하거나 직접 추가하면, 학생이 보는 동아리 페이지 달력에 나타나요.'
        link={{ label: '일정 연결하기', to: '/admin/calendar-sync' }}
      >
        <CalendarBoard events={MOCK_CALENDAR_EVENTS} />
      </FeatureRow>

      <FeatureRow
        title={'공연·행사 소식을\n홍보 게시판에 올려요'}
        caption='올린 글은 모아동 홍보 탭에 바로 올라가요. 많은 학생에게 알리고 싶다면 앱 알림 발송도 요청할 수 있어요.'
        link={{ label: '홍보 글 쓰기', to: '/admin/promotion' }}
      >
        <Styled.PromotionFit>
          <PromotionCardView article={MOCK_PROMOTION} />
        </Styled.PromotionFit>
      </FeatureRow>

      <FeatureRow
        reverse
        title={'홍보 효과를\n숫자로 확인해요'}
        caption='동아리 페이지 조회수와 지원자 수를 기간별로 볼 수 있어요.'
        link={{ label: '통계 보기', to: '/admin/statistics' }}
      >
        <Styled.Stack>
          <MetricSummary
            data={MOCK_STATISTICS_OVERVIEW}
            isLoading={false}
            isError={false}
            onRetry={neverRetry}
          />
          <TrendChart
            data={MOCK_STATISTICS_TREND}
            isLoading={false}
            isError={false}
            onRetry={neverRetry}
          />
        </Styled.Stack>
      </FeatureRow>
    </List>
  );
};

export default ClubShowcaseSection;
