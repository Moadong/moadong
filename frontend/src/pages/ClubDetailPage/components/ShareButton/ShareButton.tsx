import ShareIconMobile from '@/assets/images/icons/share_icon_mobile.svg';
import ShareIcon from '@/assets/images/icons/share_icon.svg';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import useDevice from '@/hooks/useDevice';
import useShare from '@/hooks/useShare';
import * as Styled from './ShareButton.styles';

interface ShareButtonProps {
  clubId: string;
}

const MOADONG_BASE_URL = 'https://www.moadong.com/clubDetail/';

const ShareButton = ({ clubId }: ShareButtonProps) => {
  const { isMobile } = useDevice();
  const { data: clubDetail } = useGetClubDetail(clubId);
  const trackEvent = useMixpanelTrack();
  const { handleShare } = useShare();

  if (!clubDetail) return;

  const handleClubShare = async () => {
    const url = `${MOADONG_BASE_URL}@${clubDetail.name}`;
    const text = `지금 모아동에서 ${clubDetail.name} 동아리를 확인해보세요!\n${url}`;

    await handleShare({ title: clubDetail.name, text, url });

    trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, {
      clubName: clubDetail.name,
    });
  };

  return (
    <Styled.ShareButtonContainer
      onClick={handleClubShare}
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
