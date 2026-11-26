// 상세 본문. 탭 없이 신입생이 궁금해하는 순서(뭐 하는 곳·부담·분위기·활동·가입 후)대로 섹션을 쌓는다
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { ChevronDownIcon } from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import {
  ClubAtAGlance,
  ClubFitCheck,
  ClubKeywordVotes,
  ClubMemberVoices,
  ClubYearTimeline,
} from '@/pages/ClubDetailPage/components/ClubInsights/ClubInsights';
import { sortAwardsByLatest } from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { DetailedDescription } from '@/types/club';
import { ClubInsights } from '@/types/clubInsights';
import { formatSemesterLabel, getAwardKey } from '@/utils/awardHelpers';
import { linkifyText } from '@/utils/linkifyText';
import * as Styled from './ClubDetailBody.styles';

/** 바로가기·딥링크(`?tab=`)가 스크롤할 섹션 id */
export const CLUB_SECTION_ID = {
  SCHEDULE: 'club-section-schedule',
  LOCATION: 'club-section-location',
} as const;

interface ClubDetailBodyProps {
  clubId: string;
  description: DetailedDescription;
  insights?: ClubInsights;
  /** 볼 일정이 없으면 넘기지 않는다. 빈 달력이나 '곧 업데이트' 같은 약속은 보여주지 않는다 */
  scheduleSlot?: ReactNode;
  /** 동아리방 지도·주소. 위치를 모르는 동아리는 넘기지 않는다 */
  locationSlot?: ReactNode;
}

const Section = ({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Styled.Section id={id} aria-label={title}>
    <Styled.SectionHeader>
      <Styled.SectionTitle>{title}</Styled.SectionTitle>
    </Styled.SectionHeader>
    {description && (
      <Styled.SectionDescription>{description}</Styled.SectionDescription>
    )}
    {children}
  </Styled.Section>
);

/** 긴 글을 4줄로 접고, 넘칠 때만 무엇을 펼치는지 적힌 버튼을 보여준다 */
const CollapsibleText = ({
  text,
  moreLabel,
}: {
  text: string;
  /** 예: "소개 전체 보기" */
  moreLabel: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || isExpanded) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [text, isExpanded]);

  return (
    <>
      <Styled.BodyText ref={ref} $clamped={!isExpanded}>
        {linkifyText(text)}
      </Styled.BodyText>
      {isOverflowing && !isExpanded && (
        <Styled.MoreButton type='button' onClick={() => setIsExpanded(true)}>
          {moreLabel}
          <ChevronDownIcon width={14} height={14} />
        </Styled.MoreButton>
      )}
    </>
  );
};

const ClubDetailBody = ({
  clubId,
  description,
  insights,
  scheduleSlot,
  locationSlot,
}: ClubDetailBodyProps) => {
  const trackEvent = useMixpanelTrack();
  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(
    () => new Set(),
  );

  const {
    introDescription,
    activityDescription,
    awards,
    idealCandidate,
    benefits,
    faqs,
  } = description;

  const sortedAwards = sortAwardsByLatest(awards);
  const idealTags = idealCandidate?.tags?.filter((tag) => tag.trim()) ?? [];
  const validFaqs =
    faqs?.filter((faq) => faq.question.trim() && faq.answer.trim()) ?? [];
  const hasFit =
    !!insights?.fit &&
    (insights.fit.goodFor.length > 0 || insights.fit.thinkTwice.length > 0);

  const handleToggleFaq = (index: number) => {
    const isOpening = !openFaqIndexes.has(index);
    setOpenFaqIndexes((prev) => {
      const next = new Set(prev);
      if (isOpening) next.add(index);
      else next.delete(index);
      return next;
    });
    trackEvent(USER_EVENT.FAQ_TOGGLE_CLICKED, {
      question: validFaqs[index].question,
      faq_index: index,
      club_id: clubId,
      action: isOpening ? 'open' : 'close',
    });
  };

  // 신입생이 묻는 순서대로 네 묶음을 쌓고, 굵은 구분선은 묶음 사이에만 둔다.
  // 이 동아리는(뭐 하는 곳·부담·나랑 맞나) → 부원들의 이야기 → 활동 → 궁금한 점
  const what: ReactNode[] = [];
  const voices: ReactNode[] = [];
  const doing: ReactNode[] = [];
  const after: ReactNode[] = [];

  if (introDescription?.trim()) {
    what.push(
      <Section key='intro' title='동아리 소개'>
        <CollapsibleText text={introDescription} moreLabel='소개 전체 보기' />
      </Section>,
    );
  }

  if (insights?.facts) {
    what.push(
      <Section key='facts' title='한눈에 보기'>
        <ClubAtAGlance facts={insights.facts} />
      </Section>,
    );
  }

  // 키워드 투표와 부원 한마디는 같은 '부원 목소리'라 한 섹션으로 묶는다
  const hasKeywords =
    !!insights?.keywords && insights.keywords.keywords.length > 0;
  const hasVoices = !!insights?.memberVoices?.length;
  if (hasKeywords || hasVoices) {
    voices.push(
      <Section
        key='voices'
        title='부원들의 이야기'
        description={
          insights?.keywords
            ? `부원 ${insights.keywords.participantCount}명이 직접 고르고 남긴 이야기예요`
            : '부원들이 직접 남긴 이야기예요'
        }
      >
        {hasKeywords && insights?.keywords && (
          <ClubKeywordVotes summary={insights.keywords} />
        )}
        {hasVoices && insights?.memberVoices && (
          <ClubMemberVoices voices={insights.memberVoices} />
        )}
      </Section>,
    );
  }

  // 구조화된 맞춤 정보가 없으면 동아리가 쓴 인재상 글로 대신한다
  if (hasFit && insights?.fit) {
    what.push(
      <Section key='fit' title='나랑 잘 맞을까?'>
        <ClubFitCheck fit={insights.fit} />
      </Section>,
    );
  } else if (idealCandidate?.content?.trim() || idealTags.length > 0) {
    what.push(
      <Section key='ideal' title='이런 분을 찾아요'>
        {idealTags.length > 0 && (
          <Styled.ChipList>
            {idealTags.map((tag) => (
              <Styled.Chip key={tag}>{tag}</Styled.Chip>
            ))}
          </Styled.ChipList>
        )}
        {idealCandidate.content?.trim() && (
          <Styled.BodyText>
            {linkifyText(idealCandidate.content)}
          </Styled.BodyText>
        )}
      </Section>,
    );
  }

  // 활동 설명과 1년 흐름은 같은 질문(뭘 하나?)의 답이라 한 섹션으로 묶는다
  const hasYear = !!insights?.yearlyEvents?.length;
  if (activityDescription?.trim() || hasYear) {
    doing.push(
      <Section key='activity' title='이런 활동을 해요'>
        {activityDescription?.trim() && (
          <CollapsibleText
            text={activityDescription}
            moreLabel='활동 설명 전체 보기'
          />
        )}
        {hasYear && insights?.yearlyEvents && (
          <ClubYearTimeline events={insights.yearlyEvents} />
        )}
      </Section>,
    );
  }

  if (scheduleSlot) {
    doing.push(
      <Section key='schedule' id={CLUB_SECTION_ID.SCHEDULE} title='행사일정'>
        {scheduleSlot}
      </Section>,
    );
  }

  if (sortedAwards.length > 0) {
    doing.push(
      <Section key='awards' title='활동 성과'>
        <Styled.Timeline>
          {sortedAwards.map((award, index) => {
            const awardKey = getAwardKey(award, index);
            return (
              <Styled.TimelineItem key={awardKey}>
                <Styled.TimelineLabel>
                  {formatSemesterLabel(award)}
                </Styled.TimelineLabel>
                <Styled.TimelineBody>
                  {award.achievements
                    .filter((item) => item.trim())
                    .map((item, idx) => (
                      <li key={`${awardKey}-${idx}`}>{item}</li>
                    ))}
                </Styled.TimelineBody>
              </Styled.TimelineItem>
            );
          })}
        </Styled.Timeline>
      </Section>,
    );
  }

  // 정리된 정보가 있으면 혜택은 '한눈에 보기'에 담긴다. 자유 글은 모집 안내가 섞이는 일이 많아 정리된 정보가 없을 때만 보여준다
  if (!insights && benefits?.trim()) {
    after.push(
      <Section key='benefits' title='부원이 되면'>
        <Styled.Callout>{linkifyText(benefits)}</Styled.Callout>
      </Section>,
    );
  }

  if (validFaqs.length > 0) {
    after.push(
      <Section key='faq' title='자주 묻는 질문'>
        <Styled.FaqList>
          {validFaqs.map((faq, index) => {
            const isOpen = openFaqIndexes.has(index);
            const answerId = `club-faq-answer-${index}`;
            return (
              <Styled.FaqItem key={faq.id ?? `${faq.question}-${index}`}>
                <Styled.FaqQuestion
                  type='button'
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => handleToggleFaq(index)}
                >
                  <Styled.FaqMark>Q</Styled.FaqMark>
                  <span>{faq.question}</span>
                  <Styled.FaqChevron $isOpen={isOpen}>
                    <ChevronDownIcon />
                  </Styled.FaqChevron>
                </Styled.FaqQuestion>
                <Styled.FaqAnswer id={answerId} $isOpen={isOpen}>
                  <div>
                    <Styled.FaqAnswerInner>
                      {linkifyText(faq.answer)}
                    </Styled.FaqAnswerInner>
                  </div>
                </Styled.FaqAnswer>
              </Styled.FaqItem>
            );
          })}
        </Styled.FaqList>
      </Section>,
    );
  }

  if (locationSlot) {
    after.push(
      <Section
        key='location'
        id={CLUB_SECTION_ID.LOCATION}
        title='동아리방 위치'
      >
        {locationSlot}
      </Section>,
    );
  }

  return (
    <Styled.Container>
      {[what, voices, doing, after]
        .filter((chapter) => chapter.length > 0)
        .map((chapter, index) => (
          <Styled.Chapter key={index}>{chapter}</Styled.Chapter>
        ))}
    </Styled.Container>
  );
};

export default ClubDetailBody;
