// 학생에게 실제 서비스 화면 컴포넌트(검색·카테고리·동아리 정보·일정·지원·홍보·구독)를 목업 데이터로 한 줄씩 보여주는 섹션
import introduce_club_detail from '@/assets/images/introduce/introduce_club_detail.webp';
import PromotionCardView from '@/components/promotion/PromotionCardView/PromotionCardView';
import QuestionAnswerer from '@/pages/ApplicationFormPage/components/QuestionAnswerer/QuestionAnswerer';
import QuestionContainer from '@/pages/ApplicationFormPage/components/QuestionContainer/QuestionContainer';
import ClubScheduleCalendar from '@/pages/ClubDetailPage/components/ClubScheduleCalendar/ClubScheduleCalendar';
import FeatureRow from '@/pages/IntroducePage/components/FeatureRow/FeatureRow';
import {
  List,
  ListHeading,
  ListHeadingBrand,
  MoreButton,
} from '@/pages/IntroducePage/components/FeatureRow/FeatureRow.styles';
import LockScreen from '@/pages/IntroducePage/components/LockScreen/LockScreen';
import PhoneMockup from '@/pages/IntroducePage/components/PhoneMockup/PhoneMockup';
import ScrollingCapture from '@/pages/IntroducePage/components/PhoneMockup/ScrollingCapture';
import {
  APPLY_MOTIVATION_EXAMPLES,
  APPLY_SELECTED_DAYS,
  MOCK_CALENDAR_EVENTS,
  MOCK_PROMOTIONS,
  MOCK_QUESTIONS,
  SUBSCRIBE_NOTIFICATIONS,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import useAppDownload from '@/pages/IntroducePage/hooks/useAppDownload';
import useTypewriter from '@/pages/IntroducePage/hooks/useTypewriter';
import isInAppWebView from '@/utils/isInAppWebView';
import SearchDemo from '../SearchDemo/SearchDemo';
import * as Styled from './StudentShowcaseSection.styles';

const APPLY_TYPE_MS = 70;

const noop = () => {};

const StudentShowcaseSection = () => {
  const typedMotivation = useTypewriter(
    APPLY_MOTIVATION_EXAMPLES,
    APPLY_TYPE_MS,
  );
  const openStore = useAppDownload('feature');
  const [motivationQuestion, daysQuestion] = MOCK_QUESTIONS;

  return (
    <List aria-label='모아동 기능 소개'>
      {/* 단톡방 마지막 메시지에 바로 답하는 제목 */}
      <ListHeading>
        이제 안 힘들어요
        <br />
        <ListHeadingBrand>모아동</ListHeadingBrand>이 있으니까
      </ListHeading>

      <FeatureRow
        title={'검색하거나\n분야만 골라 보세요'}
        caption='부경대 동아리가 모두 한 곳에 있어요.'
        link={{ label: '동아리 찾아보기', to: '/' }}
        screenMaxHeight={520}
      >
        <SearchDemo />
      </FeatureRow>

      <FeatureRow
        reverse
        bare
        title={'동아리 정보,\n페이지 하나에 다 있어요'}
        caption='소개, 인스타그램, 동아리방 위치, 활동 내용, 모집 대상까지 한 번에 볼 수 있어요.'
        link={{ label: '동아리 둘러보기', to: '/' }}
      >
        <PhoneMockup zoomed>
          <ScrollingCapture
            src={introduce_club_detail}
            alt='포시즌 동아리 페이지'
            viewportHeight={420}
          />
        </PhoneMockup>
      </FeatureRow>

      <FeatureRow
        title={'동아리 일정을\n달력으로 미리 봐요'}
        screenMaxHeight={460}
      >
        <ClubScheduleCalendar events={MOCK_CALENDAR_EVENTS} />
      </FeatureRow>

      <FeatureRow
        reverse
        title={'마음에 들면\n그 자리에서 지원해요'}
        caption='동아리 페이지에서 지원하기만 누르면 끝. 지원서 링크를 따로 찾아다닐 필요 없어요.'
      >
        <Styled.Stack>
          <QuestionContainer>
            <QuestionAnswerer
              question={motivationQuestion}
              number={1}
              selectedAnswers={[typedMotivation]}
              onChange={noop}
            />
          </QuestionContainer>
          <QuestionContainer>
            <QuestionAnswerer
              question={daysQuestion}
              number={2}
              selectedAnswers={APPLY_SELECTED_DAYS}
              onChange={noop}
            />
          </QuestionContainer>
        </Styled.Stack>
      </FeatureRow>

      <FeatureRow
        title={'동아리 공연과 행사 소식도\n모아동에서'}
        caption='동아리 소개 한마당, 대동제 동아리 버스킹 시간표처럼 동아리 소식이 홍보 게시판에 올라와요.'
        link={{ label: '홍보 게시판 보기', to: '/promotions' }}
        screenMaxHeight={380}
      >
        <Styled.PromotionGrid>
          {MOCK_PROMOTIONS.map((article) => (
            <PromotionCardView key={article.id} article={article} />
          ))}
        </Styled.PromotionGrid>
      </FeatureRow>

      <FeatureRow
        reverse
        bare
        title={'앱에서 구독하면\n새 소식을 알려드려요'}
        caption='관심 동아리의 모집과 행사를 놓치지 않아요.'
        action={
          !isInAppWebView() && (
            <MoreButton type='button' onClick={() => openStore()}>
              모아동 앱 받기
              <span aria-hidden='true'>›</span>
            </MoreButton>
          )
        }
      >
        <PhoneMockup overlayStatusBar zoomed>
          <LockScreen notifications={SUBSCRIBE_NOTIFICATIONS} />
        </PhoneMockup>
      </FeatureRow>
    </List>
  );
};

export default StudentShowcaseSection;
