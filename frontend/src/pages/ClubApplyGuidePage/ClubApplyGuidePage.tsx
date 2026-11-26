// 지원하기를 누르면 오는 지원 안내 페이지. 남은 시간·지원 후 일정·확인할 점·지원서 질문을 보여주고 지원서로 이어준다
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { ChevronDownIcon } from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import useApplyGuide from '@/pages/ClubDetailPage/hooks/useApplyGuide';
import useClubInsights from '@/pages/ClubDetailPage/hooks/useClubInsights';
import {
  getDeadlineCountdown,
  getRecruitmentSummary,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import isInAppWebView from '@/utils/isInAppWebView';
import { linkifyText } from '@/utils/linkifyText';
import { buildApplyTimeline } from './applyGuideTimeline';
import * as Styled from './ClubApplyGuidePage.styles';

const ClubApplyGuidePage = () => {
  const navigate = useNavigate();
  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();
  const { data: clubDetail } = useGetClubDetail((clubName ?? clubId) || '');
  const insights = useClubInsights(clubDetail?.id);
  const { data: applyGuide } = useApplyGuide(clubDetail?.id);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);

  // 상세에서 내려온 스크롤 위치를 이어받지 않고 맨 위(남은 시간)부터 보여준다.
  // 내용이 그려지기 전에 올리면 높이가 없어 소용없으니 동아리 정보가 온 뒤에 올린다
  const hasContent = !!clubDetail;
  useEffect(() => {
    if (hasContent) window.scrollTo(0, 0);
  }, [hasContent]);

  if (!clubDetail) return null;

  const status = clubDetail.recruitmentStatus;
  const countdown = getDeadlineCountdown(
    status,
    clubDetail.recruitmentStart,
    clubDetail.recruitmentEnd,
  );
  const recruitment = getRecruitmentSummary(
    status,
    clubDetail.recruitmentStart,
    clubDetail.recruitmentEnd,
  );
  const guide = insights?.recruitmentGuide;
  const timeline = buildApplyTimeline({
    status,
    start: clubDetail.recruitmentStart,
    end: clubDetail.recruitmentEnd,
    method: applyGuide?.method,
    schedule: guide?.schedule,
  });

  // 모아동 지원서만 질문을 미리 알 수 있다. 외부 폼은 열어 봐야 안다
  const questions =
    applyGuide?.forms.flatMap((form) => form.questions ?? []) ?? [];
  const originalTexts =
    applyGuide?.forms
      .map((form) => form.description?.trim())
      .filter((text): text is string => !!text) ?? [];

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('..', { relative: 'path' });
  };

  return (
    <>
      <Header hideOn={['mobile', 'tablet']} />
      <Styled.Page>
        <Styled.TopRow>
          <Styled.BackButton
            type='button'
            onClick={goBack}
            aria-label='뒤로가기'
          >
            <ChevronDownIcon width={22} height={22} />
          </Styled.BackButton>
          <Styled.TopTitle>{clubDetail.name} 지원 안내</Styled.TopTitle>
        </Styled.TopRow>

        {/* 1. 남은 시간 */}
        <Styled.CountdownCard $status={status} $isUrgent={countdown.isUrgent}>
          <Styled.CountdownHeadline>
            {countdown.headline}
          </Styled.CountdownHeadline>
          {countdown.sub && (
            <Styled.CountdownSub>{countdown.sub}</Styled.CountdownSub>
          )}
          <Styled.FactRows>
            {recruitment.period && (
              <div>
                <dt>모집 기간</dt>
                <dd>{recruitment.period}</dd>
              </div>
            )}
            {clubDetail.recruitmentTarget?.trim() && (
              <div>
                <dt>지원 대상</dt>
                <dd>{clubDetail.recruitmentTarget}</dd>
              </div>
            )}
          </Styled.FactRows>
        </Styled.CountdownCard>

        {/* 2. 지원 후 일정 */}
        <Styled.Section>
          <Styled.SectionTitle>
            {status === 'CLOSED' ? '지난 모집 일정' : '지원부터 합류까지'}
          </Styled.SectionTitle>
          {status === 'CLOSED' && (
            <Styled.SectionHint>
              다음 모집도 비슷하게 진행될 거예요
            </Styled.SectionHint>
          )}
          <Styled.Timeline>
            {timeline.map((item, index) => (
              <Styled.TimelineItem
                key={`${item.label}-${index}`}
                $state={item.state}
              >
                <Styled.TimelineDot $state={item.state} aria-hidden />
                <Styled.TimelineBody>
                  <Styled.TimelineHead>
                    <Styled.TimelineLabel>{item.label}</Styled.TimelineLabel>
                    {item.state === 'now' && (
                      <Styled.NowBadge>지금</Styled.NowBadge>
                    )}
                  </Styled.TimelineHead>
                  {(item.date || item.place) && (
                    <Styled.TimelineMeta>
                      {[item.date, item.place].filter(Boolean).join(' · ')}
                    </Styled.TimelineMeta>
                  )}
                  {item.description && (
                    <Styled.TimelineDescription>
                      {item.description}
                    </Styled.TimelineDescription>
                  )}
                </Styled.TimelineBody>
              </Styled.TimelineItem>
            ))}
          </Styled.Timeline>
        </Styled.Section>

        {/* 3. 지원 전 확인할 점 */}
        {guide?.notices && guide.notices.length > 0 && (
          <Styled.Section>
            <Styled.SectionTitle>지원 전에 확인해 주세요</Styled.SectionTitle>
            <Styled.NoticeList>
              {guide.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </Styled.NoticeList>
          </Styled.Section>
        )}

        {/* 4. 지원서 질문 미리보기 */}
        {questions.length > 0 && (
          <Styled.Section>
            <Styled.SectionTitle>
              지원서에서 이런 걸 물어봐요
            </Styled.SectionTitle>
            <Styled.SectionHint>
              질문 {questions.length}개 · 미리 생각해 두면 금방 써요
            </Styled.SectionHint>
            <Styled.QuestionList>
              {questions.map((question, index) => (
                <li key={`${question.id}-${index}`}>
                  <Styled.QuestionIndex>{index + 1}</Styled.QuestionIndex>
                  <span>
                    {question.title}
                    {question.options?.required && (
                      <Styled.Required aria-label='필수'>*</Styled.Required>
                    )}
                  </span>
                </li>
              ))}
            </Styled.QuestionList>
          </Styled.Section>
        )}

        {/* 5. 관리자가 쓴 공고 원문 */}
        {originalTexts.length > 0 && (
          <Styled.Section>
            <Styled.OriginalToggle
              type='button'
              aria-expanded={isOriginalOpen}
              onClick={() => setIsOriginalOpen((prev) => !prev)}
            >
              동아리가 쓴 모집 공고 원문
              <Styled.ToggleChevron $isOpen={isOriginalOpen}>
                <ChevronDownIcon width={18} height={18} />
              </Styled.ToggleChevron>
            </Styled.OriginalToggle>
            {isOriginalOpen &&
              originalTexts.map((text) => (
                <Styled.OriginalText key={text}>
                  {linkifyText(text)}
                </Styled.OriginalText>
              ))}
          </Styled.Section>
        )}
      </Styled.Page>
      {isInAppWebView() && <Styled.AppSpacer />}
      <ClubApplyButton />
    </>
  );
};

export default ClubApplyGuidePage;
