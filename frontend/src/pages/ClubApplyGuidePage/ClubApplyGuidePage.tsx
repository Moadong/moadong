// 지원하기를 누르면 오는 지원 안내 페이지. 언제까지·어떻게·얼마·면접·지원서 분량을 먼저 답하고 일정과 확인할 점을 정리한다
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { ChevronDownIcon } from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import {
  formatFee,
  SELECTION_LABEL,
} from '@/pages/ClubDetailPage/components/ClubInsights/ClubInsights';
import useApplyGuide, {
  ApplyMethod,
} from '@/pages/ClubDetailPage/hooks/useApplyGuide';
import useClubInsights from '@/pages/ClubDetailPage/hooks/useClubInsights';
import {
  getDeadlineCountdown,
  getRecruitmentSummary,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import isInAppWebView from '@/utils/isInAppWebView';
import { linkifyText } from '@/utils/linkifyText';
import { buildApplyTimeline, withRo } from './applyGuideTimeline';
import * as Styled from './ClubApplyGuidePage.styles';

// 질문 하나에 드는 대략적인 시간. 지원서 분량을 "약 N분"으로 알려주는 데만 쓴다
const SECONDS_PER_QUESTION = 30;
const SECONDS_PER_MINUTE = 60;
const QUESTION_PREVIEW_COUNT = 5;

const getMethodLabel = (method?: ApplyMethod) => {
  switch (method?.kind) {
    case 'EXTERNAL':
      return method.platform;
    case 'MULTIPLE':
      return `지원서 ${method.count}개 중 선택`;
    case 'CONTACT':
      return '동아리에 직접 연락';
    case 'MOADONG':
      return '모아동 지원서';
    default:
      return null;
  }
};

const getCtaLabel = (method?: ApplyMethod) => {
  switch (method?.kind) {
    case 'EXTERNAL':
      return `${withRo(method.platform)} 지원하기`;
    case 'MULTIPLE':
      return '지원서 고르기';
    case 'MOADONG':
      return '지원서 작성하기';
    default:
      return '지원하기';
  }
};

const ClubApplyGuidePage = () => {
  const navigate = useNavigate();
  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();
  const { data: clubDetail } = useGetClubDetail((clubName ?? clubId) || '');
  const insights = useClubInsights(clubDetail?.id);
  const { data: applyGuide } = useApplyGuide(clubDetail?.id);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);

  // 상세에서 내려온 스크롤 위치를 이어받지 않고 맨 위부터 보여준다.
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
  const facts = insights?.facts;
  const guide = insights?.recruitmentGuide;
  const method = applyGuide?.method;

  const timeline = buildApplyTimeline({
    status,
    start: clubDetail.recruitmentStart,
    end: clubDetail.recruitmentEnd,
    method,
    schedule: guide?.schedule,
  });

  // 모아동 지원서만 질문을 미리 알 수 있다. 외부 폼은 열어 봐야 안다
  const questions =
    applyGuide?.forms.flatMap((form) => form.questions ?? []) ?? [];
  const visibleQuestions = showAllQuestions
    ? questions
    : questions.slice(0, QUESTION_PREVIEW_COUNT);
  const estimatedMinutes = Math.max(
    1,
    Math.ceil((questions.length * SECONDS_PER_QUESTION) / SECONDS_PER_MINUTE),
  );
  const originalTexts =
    applyGuide?.forms
      .map((form) => form.description?.trim())
      .filter((text): text is string => !!text) ?? [];

  // 신입생이 가장 먼저 묻는 것: 어떻게·얼마·면접·분량·누가·언제
  const keyFacts: { label: string; value: ReactNode }[] = [];
  const methodLabel = getMethodLabel(method);
  if (methodLabel) keyFacts.push({ label: '지원 방법', value: methodLabel });
  if (facts?.fee) {
    keyFacts.push({
      label: '회비',
      value: (
        <>
          {facts.fee.period === 'SEMESTER' ? '학기' : '입회비'}{' '}
          {formatFee(facts.fee.amount)}
          {facts.feeNote && (
            <Styled.ValueNote>{facts.feeNote}</Styled.ValueNote>
          )}
        </>
      ),
    });
  }
  if (facts?.selection) {
    keyFacts.push({ label: '선발', value: SELECTION_LABEL[facts.selection] });
  }
  if (questions.length > 0) {
    keyFacts.push({
      label: '지원서',
      value: `질문 ${questions.length}개 · 약 ${estimatedMinutes}분`,
    });
  }
  if (clubDetail.recruitmentTarget?.trim()) {
    keyFacts.push({ label: '지원 대상', value: clubDetail.recruitmentTarget });
  }
  if (recruitment.period) {
    keyFacts.push({ label: '모집 기간', value: recruitment.period });
  }

  const headlineTone = countdown.isUrgent
    ? 'urgent'
    : status === 'CLOSED'
      ? 'muted'
      : 'default';

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('..', { relative: 'path' });
  };

  return (
    <>
      <Header hideOn={['mobile', 'tablet']} />
      <Styled.Page>
        <Styled.BackLink type='button' onClick={goBack}>
          <ChevronDownIcon width={18} height={18} />
          {clubDetail.name}
        </Styled.BackLink>

        <Styled.Hero>
          <Styled.Eyebrow>지원 안내</Styled.Eyebrow>
          <Styled.Headline $tone={headlineTone}>
            {countdown.headline}
          </Styled.Headline>
          {countdown.sub && <Styled.SubLine>{countdown.sub}</Styled.SubLine>}
        </Styled.Hero>

        {keyFacts.length > 0 && (
          <Styled.FactList>
            {keyFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </Styled.FactList>
        )}

        <Styled.Section>
          <Styled.SectionTitle>
            {status === 'CLOSED' ? '지난 모집은 이렇게 진행됐어요' : '일정'}
          </Styled.SectionTitle>
          <Styled.Schedule>
            {timeline.map((item, index) => (
              <Styled.ScheduleRow
                key={`${item.label}-${index}`}
                $state={item.state}
              >
                <Styled.ScheduleWhen>
                  {item.state === 'now' ? '지금' : (item.date ?? '')}
                </Styled.ScheduleWhen>
                <Styled.ScheduleWhat>
                  <strong>{item.label}</strong>
                  {item.place && <span>{item.place}</span>}
                  {item.description && <span>{item.description}</span>}
                </Styled.ScheduleWhat>
              </Styled.ScheduleRow>
            ))}
          </Styled.Schedule>
        </Styled.Section>

        {guide?.notices && guide.notices.length > 0 && (
          <Styled.Section>
            <Styled.SectionTitle>지원 전에 알아두세요</Styled.SectionTitle>
            <Styled.PlainList>
              {guide.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </Styled.PlainList>
          </Styled.Section>
        )}

        {questions.length > 0 && (
          <Styled.Section>
            <Styled.SectionTitle>지원서 질문 미리보기</Styled.SectionTitle>
            <Styled.QuestionList>
              {visibleQuestions.map((question, index) => (
                <li key={`${question.id}-${index}`}>
                  <Styled.QuestionNumber>
                    {String(index + 1).padStart(2, '0')}
                  </Styled.QuestionNumber>
                  <span>{question.title}</span>
                </li>
              ))}
            </Styled.QuestionList>
            {questions.length > QUESTION_PREVIEW_COUNT && (
              <Styled.TextButton
                type='button'
                aria-expanded={showAllQuestions}
                onClick={() => setShowAllQuestions((prev) => !prev)}
              >
                {showAllQuestions
                  ? '접기'
                  : `질문 ${questions.length}개 모두 보기`}
              </Styled.TextButton>
            )}
          </Styled.Section>
        )}

        {originalTexts.length > 0 && (
          <Styled.Section>
            <Styled.TextButton
              type='button'
              aria-expanded={isOriginalOpen}
              onClick={() => setIsOriginalOpen((prev) => !prev)}
            >
              동아리가 쓴 공고 원문 {isOriginalOpen ? '접기' : '보기'}
            </Styled.TextButton>
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
      <ClubApplyButton label={getCtaLabel(method)} />
    </>
  );
};

export default ClubApplyGuidePage;
