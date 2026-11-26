// 상세 본문. 탭 없이 한 번에 내려 읽도록 판단 정보 → 소개·사진 → 일정 → 가입·FAQ·위치 순으로 섹션을 쌓는다
import {
  ReactNode,
  SyntheticEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { ChevronDownIcon } from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import {
  ClubAtAGlance,
  ClubFitCheck,
  ClubJoinSteps,
  ClubKeywordVotes,
  ClubMemberVoices,
  ClubYearTimeline,
} from '@/pages/ClubDetailPage/components/ClubInsights/ClubInsights';
import PhotoModal from '@/pages/ClubDetailPage/components/PhotoModal/PhotoModal';
import { sortAwardsByLatest } from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { DetailedDescription } from '@/types/club';
import { ClubInsights } from '@/types/clubInsights';
import { formatSemesterLabel, getAwardKey } from '@/utils/awardHelpers';
import cdnImage, { fallbackToOriginal } from '@/utils/cdnImage';
import { linkifyText } from '@/utils/linkifyText';
import * as Styled from './ClubDetailBody.styles';

const PHOTO_PREVIEW_COUNT = 6;

/** 바로가기·딥링크(`?tab=`)가 스크롤할 섹션 id */
export const CLUB_SECTION_ID = {
  PHOTOS: 'club-section-photos',
  SCHEDULE: 'club-section-schedule',
} as const;

interface ClubDetailBodyProps {
  clubId: string;
  clubName: string;
  description: DetailedDescription;
  feeds: string[];
  insights?: ClubInsights;
  scheduleSlot: ReactNode;
  /** 모바일에서만 넘긴다. 데스크톱은 오른쪽 카드에 지도가 있다 */
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

/** 긴 글을 4줄로 접고, 넘칠 때만 더보기 버튼을 보여준다 */
const CollapsibleText = ({ text }: { text: string }) => {
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
          더보기
          <ChevronDownIcon width={16} height={16} />
        </Styled.MoreButton>
      )}
    </>
  );
};

const ClubDetailBody = ({
  clubId,
  clubName,
  description,
  feeds,
  insights,
  scheduleSlot,
  locationSlot,
}: ClubDetailBodyProps) => {
  const trackEvent = useMixpanelTrack();
  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  // 원본까지 깨진 사진은 그리드에서 뺀다 (업로드가 지워진 경우가 실제로 있다)
  const [brokenPhotos, setBrokenPhotos] = useState<Set<string>>(
    () => new Set(),
  );
  const handlePhotoError =
    (url: string) => (event: SyntheticEvent<HTMLImageElement>) => {
      if (event.currentTarget.getAttribute('src') === url) {
        setBrokenPhotos((prev) => new Set(prev).add(url));
        return;
      }
      fallbackToOriginal(url)(event);
    };

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
  const photos = feeds.filter((url) => !brokenPhotos.has(url));
  const previewPhotos = photos.slice(0, PHOTO_PREVIEW_COUNT);
  const hiddenPhotoCount = photos.length - previewPhotos.length;
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

  // 섹션을 네 묶음(판단 정보·동아리 이야기·일정과 성과·가입 안내)으로 모으고, 굵은 구분선은 묶음 사이에만 둔다
  const decide: ReactNode[] = [];
  const story: ReactNode[] = [];
  const time: ReactNode[] = [];
  const join: ReactNode[] = [];

  // 1. 판단에 바로 쓰는 사실
  if (insights?.facts) {
    decide.push(
      <Section key='facts' title='한눈에 보기'>
        <ClubAtAGlance facts={insights.facts} />
      </Section>,
    );
  }

  if (insights?.keywords && insights.keywords.keywords.length > 0) {
    decide.push(
      <Section
        key='keywords'
        title='부원들이 꼽은 매력'
        description='실제 부원이 직접 고른 키워드예요'
      >
        <ClubKeywordVotes summary={insights.keywords} />
      </Section>,
    );
  }

  // 구조화된 맞춤 정보가 없으면 동아리가 쓴 인재상 글로 대신한다
  if (hasFit && insights?.fit) {
    decide.push(
      <Section key='fit' title='나랑 잘 맞을까?'>
        <ClubFitCheck fit={insights.fit} />
      </Section>,
    );
  } else if (idealCandidate?.content?.trim() || idealTags.length > 0) {
    decide.push(
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

  // 2. 동아리 이야기
  if (introDescription?.trim() || activityDescription?.trim()) {
    story.push(
      <Section key='intro' title={`${clubName} 이야기`}>
        {introDescription?.trim() && (
          <CollapsibleText text={introDescription} />
        )}
        {activityDescription?.trim() && (
          <Styled.Callout>{linkifyText(activityDescription)}</Styled.Callout>
        )}
      </Section>,
    );
  }

  if (previewPhotos.length > 0) {
    story.push(
      <Section
        key='photos'
        id={CLUB_SECTION_ID.PHOTOS}
        title={`활동사진 ${photos.length}`}
      >
        <Styled.PhotoGrid>
          {previewPhotos.map((url, index) => {
            const isLast = index === previewPhotos.length - 1;
            return (
              <Styled.PhotoTile
                key={`${url}-${index}`}
                type='button'
                onClick={() => setPhotoIndex(index)}
                aria-label={`${clubName} 활동사진 ${index + 1} 크게 보기`}
              >
                <img
                  src={cdnImage(url, 'grid')}
                  onError={handlePhotoError(url)}
                  alt=''
                  loading='lazy'
                />
                {isLast && hiddenPhotoCount > 0 && (
                  <Styled.PhotoMore>+{hiddenPhotoCount}</Styled.PhotoMore>
                )}
              </Styled.PhotoTile>
            );
          })}
        </Styled.PhotoGrid>
      </Section>,
    );
  }

  if (insights?.memberVoices && insights.memberVoices.length > 0) {
    story.push(
      <Section key='voices' title='부원 한마디'>
        <ClubMemberVoices voices={insights.memberVoices} />
      </Section>,
    );
  }

  // 3. 시간 계획
  if (insights?.yearlyEvents && insights.yearlyEvents.length > 0) {
    time.push(
      <Section
        key='year'
        title='1년 동안 이런 걸 해요'
        description='들어오면 1년이 이렇게 흘러가요'
      >
        <ClubYearTimeline events={insights.yearlyEvents} />
      </Section>,
    );
  }

  time.push(
    <Section key='schedule' id={CLUB_SECTION_ID.SCHEDULE} title='행사일정'>
      {scheduleSlot}
    </Section>,
  );

  if (sortedAwards.length > 0) {
    time.push(
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

  // 4. 가입
  if (benefits?.trim()) {
    join.push(
      <Section key='benefits' title='부원이 되면'>
        <Styled.Callout>{linkifyText(benefits)}</Styled.Callout>
      </Section>,
    );
  }

  if (insights?.joinSteps && insights.joinSteps.length > 0) {
    join.push(
      <Section key='join' title='가입은 이렇게 해요'>
        <ClubJoinSteps steps={insights.joinSteps} />
      </Section>,
    );
  }

  if (validFaqs.length > 0) {
    join.push(
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
    join.push(
      <Section key='location' title='동아리방 위치'>
        {locationSlot}
      </Section>,
    );
  }

  return (
    <>
      <Styled.Container>
        {[decide, story, time, join]
          .filter((chapter) => chapter.length > 0)
          .map((chapter, index) => (
            <Styled.Chapter key={index}>{chapter}</Styled.Chapter>
          ))}
      </Styled.Container>
      <PhotoModal
        isOpen={photoIndex !== null}
        onClose={() => setPhotoIndex(null)}
        clubName={clubName}
        photos={{
          currentIndex: photoIndex ?? 0,
          urls: photos,
          onChangeIndex: setPhotoIndex,
        }}
      />
    </>
  );
};

export default ClubDetailBody;
