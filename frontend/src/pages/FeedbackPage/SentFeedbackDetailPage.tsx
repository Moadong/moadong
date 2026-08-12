import { Navigate, useParams } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import {
  FEEDBACK_CONTENT_MAX_LENGTH,
  FEEDBACK_TYPE_META,
} from '@/constants/feedback';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useSentFeedback } from '@/hooks/Queries/useFeedback';
import FeedbackTag from './components/FeedbackTag';
import * as Styled from './FeedbackWritePage.styles';

/**
 * 보낸 편지 상세 (시안 11435:891 '보낸편지_ just view').
 * 이미 발송된 내용이라 수정할 수 없어, 작성 화면에서 사진 추가와 저장하기 버튼을 뺀 읽기 전용 화면이다.
 */
const SentFeedbackDetailPage = () => {
  useTrackPageView(PAGE_VIEW.SENT_FEEDBACK_DETAIL_PAGE);
  const { feedbackId } = useParams<{ feedbackId: string }>();
  const {
    data: feedback,
    isLoading,
    isError,
  } = useSentFeedback(feedbackId ?? '');

  if (!feedbackId) return <Navigate to='/feedback?tab=sent' replace />;

  const meta = feedback ? FEEDBACK_TYPE_META[feedback.type] : null;

  return (
    <Styled.Container>
      <WebviewTopBar title='보낸 편지' />

      {isLoading && <Spinner />}
      {!isLoading && (isError || !feedback) && (
        <Styled.Message>편지를 불러오지 못했어요.</Styled.Message>
      )}

      {feedback && meta && (
        <Styled.Content>
          <Styled.Heading>
            <Styled.HeadingTop>
              <FeedbackTag
                label={meta.tagLabel}
                backgroundColor={meta.backgroundColor}
                color={meta.accentColor}
                Icon={meta.Icon}
              />
              <Styled.Title>{meta.title}</Styled.Title>
            </Styled.HeadingTop>
            <Styled.Description>{meta.description}</Styled.Description>
          </Styled.Heading>

          <Styled.ContentField>
            <Styled.TextArea
              value={feedback.content}
              readOnly
              aria-label='보낸 피드백 내용'
            />
            <Styled.CharCount>
              {feedback.content.length}/{FEEDBACK_CONTENT_MAX_LENGTH}
            </Styled.CharCount>
          </Styled.ContentField>
        </Styled.Content>
      )}
    </Styled.Container>
  );
};

export default SentFeedbackDetailPage;
