// 상세 '홈' 탭. 소개·사진 미리보기·활동·인재상·혜택·성과·FAQ·위치를 섹션으로 나눠 보여준다
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import { sortAwardsByLatest } from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { DetailedDescription } from '@/types/club';
import { formatSemesterLabel, getAwardKey } from '@/utils/awardHelpers';
import cdnImage, { fallbackToOriginal } from '@/utils/cdnImage';
import { linkifyText } from '@/utils/linkifyText';
import * as Styled from './ClubHomeTab.styles';

const PHOTO_PREVIEW_COUNT = 6;

interface ClubHomeTabProps {
  clubId: string;
  clubName: string;
  description: DetailedDescription;
  feeds: string[];
  onShowAllPhotos: () => void;
  /** 모바일에서만 넘긴다. 데스크톱은 오른쪽 카드에 지도가 있다 */
  locationSlot?: ReactNode;
}

const Section = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <Styled.Section>
    <Styled.SectionHeader>
      <Styled.SectionTitle>{title}</Styled.SectionTitle>
      {action}
    </Styled.SectionHeader>
    {children}
  </Styled.Section>
);

/** 긴 소개 글을 4줄로 접고, 넘칠 때만 더보기 버튼을 보여준다 */
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

const ClubHomeTab = ({
  clubId,
  clubName,
  description,
  feeds,
  onShowAllPhotos,
  locationSlot,
}: ClubHomeTabProps) => {
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
  const previewPhotos = feeds.slice(0, PHOTO_PREVIEW_COUNT);

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

  const sections: ReactNode[] = [];

  if (introDescription?.trim()) {
    sections.push(
      <Section key='intro' title='소개'>
        <CollapsibleText text={introDescription} />
      </Section>,
    );
  }

  if (previewPhotos.length > 0) {
    sections.push(
      <Section
        key='photos'
        title='활동사진'
        action={
          <Styled.HeaderLink type='button' onClick={onShowAllPhotos}>
            {feeds.length}장 전체보기
            <ChevronRightIcon />
          </Styled.HeaderLink>
        }
      >
        <Styled.PhotoStrip>
          {previewPhotos.map((url, index) => (
            <Styled.PhotoThumb
              key={`${url}-${index}`}
              type='button'
              onClick={onShowAllPhotos}
              aria-label={`${clubName} 활동사진 ${index + 1}`}
            >
              <img
                src={cdnImage(url, 'grid')}
                onError={fallbackToOriginal(url)}
                alt=''
                loading='lazy'
              />
            </Styled.PhotoThumb>
          ))}
        </Styled.PhotoStrip>
      </Section>,
    );
  }

  if (activityDescription?.trim()) {
    sections.push(
      <Section key='activity' title='이런 활동을 해요'>
        <CollapsibleText text={activityDescription} />
      </Section>,
    );
  }

  if (idealCandidate?.content?.trim() || idealTags.length > 0) {
    sections.push(
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

  if (benefits?.trim()) {
    sections.push(
      <Section key='benefits' title='부원이 되면'>
        <Styled.Callout>{linkifyText(benefits)}</Styled.Callout>
      </Section>,
    );
  }

  if (sortedAwards.length > 0) {
    sections.push(
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

  if (validFaqs.length > 0) {
    sections.push(
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
    sections.push(
      <Section key='location' title='동아리방 위치'>
        {locationSlot}
      </Section>,
    );
  }

  if (sections.length === 0) {
    return (
      <Styled.EmptyState>
        곧 새로운 소개가 업데이트될 예정이에요
      </Styled.EmptyState>
    );
  }

  return <Styled.Container>{sections}</Styled.Container>;
};

export default ClubHomeTab;
