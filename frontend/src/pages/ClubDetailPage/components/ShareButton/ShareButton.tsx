import ShareIconMobile from '@/assets/images/icons/share_icon_mobile.svg';
import ShareIcon from '@/assets/images/icons/share_icon.svg';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './ShareButton.styles';

interface ShareButtonProps {
  clubId: string;
}

const isRNWebView = isInAppWebView();

const MOADONG_BASE_URL = 'https://www.moadong.com/club/';

const ShareButton = ({ clubId }: ShareButtonProps) => {
  const { isMobile } = useDevice();
  const { data: clubDetail } = useGetClubDetail(clubId);
  const trackEvent = useMixpanelTrack();

  if (!clubDetail) return;

  const handleShare = async () => {
    const url = `${MOADONG_BASE_URL}${clubDetail.id}`;

    const rnWebView = (window as any).ReactNativeWebView;

    if (isRNWebView && rnWebView?.postMessage) {
      const sharePayload = {
        title: clubDetail.name,
        text: `지금 모아동에서 ${clubDetail.name} 동아리를 확인해보세요!`,
        url,
      };

      rnWebView.postMessage(
        JSON.stringify({ type: 'SHARE', payload: sharePayload }),
      );

      trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, {
        clubName: clubDetail.name,
        method: 'rn_webview_share',
      });
      return;
    }

    const shareData = {
      text: `지금 모아동에서 ${clubDetail.name} 동아리를 확인해보세요!\n${url}`,
    };

    // 모바일에서는 Web Share API 사용, 데스크톱에서는 클립보드 복사
    if (isMobile && navigator.share && !isRNWebView) {
      try {
        await navigator.share(shareData);
        trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, {
          clubName: clubDetail.name,
          method: 'web_share',
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        try {
          await navigator.clipboard.writeText(shareData.text);
          alert('링크가 복사되었습니다.');
          trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, {
            clubName: clubDetail.name,
            method: 'clipboard',
          });
        } catch {
          alert('공유하기에 실패했습니다.');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('링크가 복사되었습니다.');
        trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, {
          clubName: clubDetail.name,
          method: 'clipboard',
        });
      } catch {
        alert('공유하기에 실패했습니다.');
      }
    }
  };

  return (
    <Styled.ShareButtonContainer
      onClick={handleShare}
      role='button'
      aria-label='동아리 정보 공유하기'
    >
      <Styled.ShareButtonIcon
        src={isMobile ? ShareIconMobile : ShareIcon}
        alt='공유하기'
      />
    </Styled.ShareButtonContainer>
  );
};

export default ShareButton;
