import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import FeedbackPromptDialog from '@/components/common/FeedbackPromptDialog/FeedbackPromptDialog';
import { consumeClubDetailVisit, clearClubDetailVisit } from '@/feedbackPrompt/clubDetailVisit';
import { requestFeedbackPrompt } from '@/feedbackPrompt/feedbackPromptController';

const isDetailPath = (pathname: string) => /^\/(club\/|clubDetail\/)/.test(pathname) && !pathname.endsWith('/map');
const FeedbackPromptHost = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPathRef = useRef(location.pathname);
  useEffect(() => {
    const previous = previousPathRef.current;
    previousPathRef.current = location.pathname;
    if (!isDetailPath(previous)) return;
    const visit = consumeClubDetailVisit();
    if (!visit) return;
    if (
      navigationType !== 'REPLACE' &&
      (location.pathname === '/' || location.pathname === '/subscriptions')
    ) {
      void requestFeedbackPrompt({ eventId: `exit:${visit.id}`, triggerType: 'USER_CLUB_DETAIL_EXIT', clubId: visit.clubId, sourcePath: visit.pathname });
    } else if (!isDetailPath(location.pathname)) clearClubDetailVisit();
  }, [location.pathname, navigationType]);
  return <FeedbackPromptDialog />;
};
export default FeedbackPromptHost;
