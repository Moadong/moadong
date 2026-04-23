import { useCallback, useEffect, useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import {
  AppToWebMessage,
  requestSubscribeState,
  requestSubscribeToggle,
} from '@/utils/webviewBridge';

const useWebviewSubscribe = () => {
  const trackEvent = useMixpanelTrack();
  const [subscribedClubIds, setSubscribedClubIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data: AppToWebMessage;
      try {
        data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (data.type === 'SUBSCRIBE_STATE') {
        const incoming = data.payload.subscribedClubIds;
        setSubscribedClubIds((prev) => {
          if (
            prev.size === incoming.length &&
            incoming.every((id) => prev.has(id))
          )
            return prev;
          return new Set(incoming);
        });
      } else if (data.type === 'SUBSCRIBE_RESULT') {
        const { clubId, subscribed } = data.payload;
        setSubscribedClubIds((prev) => {
          const alreadyCorrect = subscribed
            ? prev.has(clubId)
            : !prev.has(clubId);
          if (alreadyCorrect) return prev;
          const next = new Set(prev);
          if (subscribed) next.add(clubId);
          else next.delete(clubId);
          return next;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    requestSubscribeState();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const toggleSubscribe = useCallback(
    (clubId: string, subscribed: boolean) => {
      requestSubscribeToggle(clubId);
      trackEvent(USER_EVENT.WEBVIEW_SUBSCRIBE_TOGGLED, {
        club_id: clubId,
        subscribed: !subscribed,
      });
    },
    [trackEvent],
  );

  return { subscribedClubIds, toggleSubscribe };
};

export default useWebviewSubscribe;
