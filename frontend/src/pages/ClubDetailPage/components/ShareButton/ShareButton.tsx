import ShareIcon from '@/assets/images/icons/share_icon.svg';
import { USER_EVENT } from '@/constants/eventName';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './ShareButton.styles';

interface ShareButtonProps {
  clubId: string;
}

const MOADONG_BASE_URL = 'https://www.moadong.com/club/';
const DEFAULT_IMAGE_URL =
  'https://avatars.githubusercontent.com/u/200371900?s=200&v=4';

const ShareButton = ({ clubId }: ShareButtonProps) => {
  const { data: clubDetail } = useGetClubDetail(clubId);
  const trackEvent = useMixpanelTrack();

  if (!clubDetail) return;

  const handleShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오 SDK가 아직 준비되지 않았습니다.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: clubDetail.name,
        description: clubDetail.description.introDescription,
        imageUrl: clubDetail.logo ? clubDetail.logo : DEFAULT_IMAGE_URL,
        link: {
          mobileWebUrl: `${MOADONG_BASE_URL}${clubDetail.id}`,
          webUrl: `${MOADONG_BASE_URL}${clubDetail.id}`,
        },
      },
      buttons: [
        {
          title: '모아동에서 지원하기',
          link: {
            mobileWebUrl: `${MOADONG_BASE_URL}${clubDetail.id}`,
            webUrl: `${MOADONG_BASE_URL}${clubDetail.id}`,
          },
        },
      ],
    });
    trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, { clubName: clubDetail.name });
  };

  return (
    <Styled.ShareButtonContainer
      onClick={handleShare}
      role='button'
      aria-label='카카오톡으로 동아리 정보 공유하기'
    >
      <Styled.ShareButtonIcon src={ShareIcon} alt='카카오톡 공유' />
    </Styled.ShareButtonContainer>
  );
};

export default ShareButton;
