import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WriteIcon from '@/assets/images/icons/feedback/feedback_write_fab.svg?react';
import Spinner from '@/components/common/Spinner/Spinner';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import {
  LETTER_CATEGORY_META,
  LETTER_CATEGORY_ORDER,
} from '@/constants/feedback';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  useReceivedLetters,
  useSentFeedbacks,
} from '@/hooks/Queries/useFeedback';
import type { LetterCategory } from '@/types/feedback';
import ReceivedLetterItem from './components/ReceivedLetterItem';
import SentFeedbackItem from './components/SentFeedbackItem';
import * as Styled from './FeedbackListPage.styles';

const FeedbackListPage = () => {
  useTrackPageView(PAGE_VIEW.FEEDBACK_LIST_PAGE);
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<LetterCategory | undefined>();

  const isSentTab = searchParams.get('tab') === 'sent';

  const {
    data: receivedLetters = [],
    isLoading: isReceivedLoading,
    isError: isReceivedError,
  } = useReceivedLetters(category);
  const { data: allReceivedLetters = [] } = useReceivedLetters();
  const {
    data: sentFeedbacks = [],
    isLoading: isSentLoading,
    isError: isSentError,
  } = useSentFeedbacks();

  const hasUnread = (target: LetterCategory) =>
    allReceivedLetters.some(
      (letter) => letter.category === target && !letter.isRead,
    );

  const handleTabChange = (tab: 'received' | 'sent') => {
    setSearchParams(tab === 'sent' ? { tab: 'sent' } : {}, { replace: true });
  };

  return (
    <Styled.Container>
      <WebviewTopBar title='모아동 우체통' />

      <Styled.Tabs>
        <Styled.Tab
          type='button'
          $active={!isSentTab}
          onClick={() => handleTabChange('received')}
        >
          받은 편지
        </Styled.Tab>
        <Styled.Tab
          type='button'
          $active={isSentTab}
          onClick={() => handleTabChange('sent')}
        >
          보낸 편지
        </Styled.Tab>
      </Styled.Tabs>

      {isSentTab ? (
        <>
          {isSentLoading && <Spinner />}
          {!isSentLoading && isSentError && (
            <Styled.EmptyText>편지를 불러오지 못했어요.</Styled.EmptyText>
          )}
          {!isSentLoading && !isSentError && sentFeedbacks.length === 0 ? (
            <Styled.EmptyText>아직 보낸 편지가 없어요.</Styled.EmptyText>
          ) : (
            sentFeedbacks.map((feedback) => (
              <SentFeedbackItem
                key={feedback.id}
                feedback={feedback}
                onClick={(feedbackId) =>
                  navigate(`/feedback/sent/${feedbackId}`)
                }
              />
            ))
          )}
        </>
      ) : (
        <>
          <Styled.Filters>
            <Styled.FilterChip
              type='button'
              $active={category === undefined}
              onClick={() => setCategory(undefined)}
            >
              전체
            </Styled.FilterChip>
            {LETTER_CATEGORY_ORDER.map((value) => (
              <Styled.FilterChip
                key={value}
                type='button'
                $active={category === value}
                onClick={() => setCategory(value)}
              >
                {LETTER_CATEGORY_META[value].label}
                {hasUnread(value) && <Styled.UnreadDot />}
              </Styled.FilterChip>
            ))}
          </Styled.Filters>

          {isReceivedLoading && <Spinner />}
          {!isReceivedLoading && isReceivedError && (
            <Styled.EmptyText>편지를 불러오지 못했어요.</Styled.EmptyText>
          )}
          {!isReceivedLoading &&
          !isReceivedError &&
          receivedLetters.length === 0 ? (
            <Styled.EmptyText>아직 받은 편지가 없어요.</Styled.EmptyText>
          ) : (
            receivedLetters.map((letter) => (
              <ReceivedLetterItem
                key={letter.id}
                letter={letter}
                onClick={(letterId) => {
                  trackEvent(USER_EVENT.RECEIVED_LETTER_OPENED, {
                    category: letter.category,
                  });
                  navigate(`/feedback/letters/${letterId}`);
                }}
              />
            ))
          )}
        </>
      )}

      <Styled.WriteButton
        type='button'
        aria-label='편지 쓰기'
        onClick={() => navigate('/feedback/write')}
      >
        <WriteIcon width={14} height={14} aria-hidden />
      </Styled.WriteButton>
    </Styled.Container>
  );
};

export default FeedbackListPage;
