import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import { FEEDBACK_TYPE_META, LETTER_CATEGORY_META } from '@/constants/feedback';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import {
  useMarkLetterAsRead,
  useReceivedLetter,
} from '@/hooks/Queries/useFeedback';
import formatTimeAgo from '@/utils/formatTimeAgo';
import FeedbackTag from './components/FeedbackTag';
import * as Styled from './LetterDetailPage.styles';

/** 시안 표기: 2026년 05월 27일 */
const formatSentAt = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}년 ${month}월 ${day}일`;
};

const LetterDetailPage = () => {
  useTrackPageView(PAGE_VIEW.RECEIVED_LETTER_DETAIL_PAGE);
  const { letterId } = useParams<{ letterId: string }>();
  const navigate = useNavigate();
  const {
    data: letter,
    isLoading,
    isError,
  } = useReceivedLetter(letterId ?? '');
  const { mutate: markAsRead } = useMarkLetterAsRead();
  const markedLetterIdRef = useRef<string | null>(null);

  // 상세를 연 시점에 읽음 처리한다.
  // 재조회로 letter 참조가 바뀌어도 편지당 한 번만 보내도록 ref로 막는다.
  useEffect(() => {
    if (!letterId || !letter) return;
    if (markedLetterIdRef.current === letterId) return;

    markedLetterIdRef.current = letterId;
    markAsRead(letterId);
  }, [letterId, letter, markAsRead]);

  if (!letterId) return <Navigate to='/feedback' replace />;

  const category = letter ? LETTER_CATEGORY_META[letter.category] : null;
  const myFeedbackType = letter?.myFeedback
    ? FEEDBACK_TYPE_META[letter.myFeedback.type]
    : null;

  return (
    <Styled.Container>
      <WebviewTopBar title='받은 편지' />

      {isLoading && <Spinner />}
      {!isLoading && (isError || !letter) && (
        <Styled.Message>편지를 불러오지 못했어요.</Styled.Message>
      )}

      {letter && category && (
        <Styled.Content>
          <Styled.Header>
            <FeedbackTag
              label={category.label}
              backgroundColor={category.backgroundColor}
              color={category.color}
            />
            <Styled.Title>{letter.title}</Styled.Title>
            <Styled.SentAt>{formatSentAt(letter.createdAt)}</Styled.SentAt>
          </Styled.Header>

          {letter.myFeedback && myFeedbackType && (
            <Styled.QuoteCard
              type='button'
              onClick={() =>
                navigate(`/feedback/sent/${letter.myFeedback?.id ?? ''}`)
              }
            >
              <Styled.QuoteLabel>내가 보낸 편지</Styled.QuoteLabel>
              <Styled.QuoteBody>
                <Styled.QuoteContent>
                  {letter.myFeedback.content}
                </Styled.QuoteContent>
                <Styled.QuoteMeta>
                  <FeedbackTag
                    label={myFeedbackType.tagLabel}
                    backgroundColor={myFeedbackType.backgroundColor}
                    color={myFeedbackType.accentColor}
                    Icon={myFeedbackType.Icon}
                  />
                  <Styled.TimeAgo>
                    {formatTimeAgo(letter.myFeedback.createdAt)}
                  </Styled.TimeAgo>
                </Styled.QuoteMeta>
              </Styled.QuoteBody>
            </Styled.QuoteCard>
          )}

          <Styled.BodyCard>
            <Markdown>{letter.body}</Markdown>
          </Styled.BodyCard>
        </Styled.Content>
      )}
    </Styled.Container>
  );
};

export default LetterDetailPage;
