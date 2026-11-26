// 신입생 판단을 돕는 구조화 섹션들: 한눈에 보기·부원 키워드·나랑 맞을까·1년 활동·가입 과정·부원 한마디
import { useEffect, useState } from 'react';
import HorizontalScroller from '@/pages/ClubDetailPage/components/HorizontalScroller/HorizontalScroller';
import { Emoji } from '@/pages/IntroducePage/components/Tossface/Tossface';
import {
  ClubFacts,
  ClubFit,
  ClubKeywordSummary,
  ClubMemberVoice,
  ClubYearlyEvent,
} from '@/types/clubInsights';
import * as Styled from './ClubInsights.styles';

const KEYWORD_PREVIEW_COUNT = 5;
const WON_PER_MAN = 10000;

export const SELECTION_LABEL: Record<
  NonNullable<ClubFacts['selection']>,
  string
> = {
  NONE: '면접 없이 바로',
  DOCUMENT: '서류 지원',
  INTERVIEW: '서류 + 면접',
  AUDITION: '오디션',
};

export const formatFee = (amount: number) => {
  if (amount === 0) return '무료';
  if (amount % WON_PER_MAN === 0) return `${amount / WON_PER_MAN}만원`;
  return `${amount.toLocaleString('ko-KR')}원`;
};

/* ── 한눈에 보기 ─────────────────────────────────────────────────────── */

export const ClubAtAGlance = ({ facts }: { facts: ClubFacts }) => {
  const cards: { emoji: string; label: string; value: string; sub?: string }[] =
    [];

  if (facts.meetingSchedule) {
    cards.push({ emoji: '🗓️', label: '활동', value: facts.meetingSchedule });
  }
  if (facts.fee) {
    const periodLabel = facts.fee.period === 'SEMESTER' ? '학기' : '입회비';
    cards.push({
      emoji: '💰',
      label: '회비',
      value: `${periodLabel} ${formatFee(facts.fee.amount)}`,
      sub: facts.feeNote,
    });
  }
  if (facts.memberCount) {
    cards.push({ emoji: '👥', label: '부원', value: `${facts.memberCount}명` });
  }
  if (facts.beginnerFriendly !== undefined) {
    cards.push({
      emoji: facts.beginnerFriendly ? '🔰' : '🎯',
      label: '경험',
      value: facts.beginnerFriendly ? '처음이어도 괜찮아요' : '경험자 우대',
    });
  }
  if (facts.selection) {
    cards.push({
      emoji: '📝',
      label: '선발',
      value: SELECTION_LABEL[facts.selection],
    });
  }
  if (facts.extraPerk) {
    cards.push({
      emoji: facts.extraPerk.emoji,
      label: '혜택',
      value: facts.extraPerk.label,
    });
  }

  if (cards.length === 0) return null;

  return (
    <Styled.FactGrid>
      {cards.map((card) => (
        <Styled.FactCard key={card.label}>
          <Styled.FactEmoji>
            <Emoji aria-hidden>{card.emoji}</Emoji>
          </Styled.FactEmoji>
          <Styled.FactLabel>{card.label}</Styled.FactLabel>
          <Styled.FactValue>{card.value}</Styled.FactValue>
          {card.sub && <Styled.FactSub>{card.sub}</Styled.FactSub>}
        </Styled.FactCard>
      ))}
    </Styled.FactGrid>
  );
};

/* ── 부원 키워드 투표 ────────────────────────────────────────────────── */

export const ClubKeywordVotes = ({
  summary,
}: {
  summary: ClubKeywordSummary;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // 처음 그릴 때 0에서 늘어나게 한 프레임 늦게 폭을 채운다
  const [isFilled, setIsFilled] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsFilled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const sorted = [...summary.keywords].sort((a, b) => b.count - a.count);
  const maxCount = sorted[0]?.count ?? 0;
  const visible = isExpanded ? sorted : sorted.slice(0, KEYWORD_PREVIEW_COUNT);
  const hiddenCount = sorted.length - KEYWORD_PREVIEW_COUNT;

  if (sorted.length === 0) return null;

  return (
    <Styled.VoteBlock>
      <Styled.VoteList>
        {visible.map((keyword, index) => {
          const ratio = maxCount > 0 ? keyword.count / maxCount : 0;
          return (
            <Styled.VoteRow key={keyword.id}>
              <Styled.VoteFill
                $ratio={isFilled ? ratio : 0}
                $isTop={index === 0}
                aria-hidden
              />
              <Styled.VoteEmoji>
                <Emoji aria-hidden>{keyword.emoji}</Emoji>
              </Styled.VoteEmoji>
              <Styled.VoteLabel>“{keyword.label}”</Styled.VoteLabel>
              <Styled.VoteCount aria-label={`${keyword.count}명`}>
                {keyword.count}
              </Styled.VoteCount>
            </Styled.VoteRow>
          );
        })}
      </Styled.VoteList>
      {hiddenCount > 0 && (
        <Styled.GhostButton
          type='button'
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? '접기' : `키워드 ${hiddenCount}개 더보기`}
        </Styled.GhostButton>
      )}
    </Styled.VoteBlock>
  );
};

/* ── 나랑 맞을까 ─────────────────────────────────────────────────────── */

export const ClubFitCheck = ({ fit }: { fit: ClubFit }) => (
  <Styled.FitGrid>
    {fit.goodFor.length > 0 && (
      <Styled.FitCard $tone='good'>
        <Styled.FitTitle>
          <Emoji aria-hidden>🙆</Emoji> 이런 분께 잘 맞아요
        </Styled.FitTitle>
        <Styled.FitList $tone='good'>
          {fit.goodFor.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </Styled.FitList>
      </Styled.FitCard>
    )}
    {fit.thinkTwice.length > 0 && (
      <Styled.FitCard $tone='caution'>
        <Styled.FitTitle>
          <Emoji aria-hidden>🤔</Emoji> 한 번 더 고민해 보세요
        </Styled.FitTitle>
        <Styled.FitList $tone='caution'>
          {fit.thinkTwice.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </Styled.FitList>
      </Styled.FitCard>
    )}
  </Styled.FitGrid>
);

/* ── 1년 활동 ────────────────────────────────────────────────────────── */

export const ClubYearTimeline = ({
  events,
  today = new Date(),
}: {
  events: ClubYearlyEvent[];
  today?: Date;
}) => {
  const sorted = [...events].sort((a, b) => a.month - b.month);
  const currentMonth = today.getMonth() + 1;
  // 올해 남은 일정이 없으면 내년 첫 일정을 '다가오는 일정'으로 본다
  const upcoming =
    sorted.find((event) => event.month >= currentMonth) ?? sorted[0];

  return (
    <HorizontalScroller label='1년 활동'>
      <Styled.YearScroller>
        {sorted.map((event) => {
          const isUpcoming = event === upcoming;
          return (
            <Styled.MonthCard
              key={`${event.month}-${event.title}`}
              $isUpcoming={isUpcoming}
            >
              <Styled.MonthLabel $isUpcoming={isUpcoming}>
                {event.month}월
                {isUpcoming && <Styled.NextBadge>다음</Styled.NextBadge>}
              </Styled.MonthLabel>
              <Styled.MonthEmoji>
                <Emoji aria-hidden>{event.emoji}</Emoji>
              </Styled.MonthEmoji>
              <Styled.MonthTitle>{event.title}</Styled.MonthTitle>
            </Styled.MonthCard>
          );
        })}
      </Styled.YearScroller>
    </HorizontalScroller>
  );
};

/* ── 부원 한마디 ─────────────────────────────────────────────────────── */

export const ClubMemberVoices = ({ voices }: { voices: ClubMemberVoice[] }) => (
  <HorizontalScroller label='부원 한마디'>
    <Styled.VoiceScroller>
      {voices.map((voice) => (
        <Styled.VoiceCard key={voice.quote}>
          <Styled.VoiceQuote>{voice.quote}</Styled.VoiceQuote>
          <Styled.VoiceAuthor>
            {voice.author}
            {voice.tenure && <span> · {voice.tenure}</span>}
          </Styled.VoiceAuthor>
        </Styled.VoiceCard>
      ))}
    </Styled.VoiceScroller>
  </HorizontalScroller>
);
