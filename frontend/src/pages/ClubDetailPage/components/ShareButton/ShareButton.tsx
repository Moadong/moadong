import React from 'react';
import * as Styled from './ShareButton.styles';
import ShareIcon from '@/assets/images/icons/share_icon.svg';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';

interface ShareButtonProps {
  clubId: string;
}

const ShareButton = ({ clubId }: ShareButtonProps) => {
  const { data: clubDetail } = useGetClubDetail(clubId);
  const trackEvent = useMixpanelTrack();

  const handleShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오 SDK가 아직 준비되지 않았습니다.');
      return;
    }
    if (!clubDetail) return;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: clubDetail.name,
        description: clubDetail.description,
        imageUrl: clubDetail.logo
          ? clubDetail.logo
          : 'https://avatars.githubusercontent.com/u/200371900?s=200&v=4',
        link: {
          mobileWebUrl: `https://www.moadong.com/club/${clubDetail.id}`,
          webUrl: `https://www.moadong.com/club/${clubDetail.id}`,
        },
      },
      buttons: [
        {
          title: '모아동에서 지원하기',
          link: {
            mobileWebUrl: `https://www.moadong.com/club/${clubDetail.id}`,
            webUrl: `https://www.moadong.com/club/${clubDetail.id}`,
          },
        },
      ],
    });
    trackEvent(`${clubDetail.name} 공유하기 버튼 클릭`);
  };

  return (
    <Styled.ShareButtonContainer
      onClick={handleShare}
      role='button'
      aria-label='카카오톡으로 동아리 정보 공유하기'
    >
      <img src={ShareIcon} alt='카카오톡 공유' />
    </Styled.ShareButtonContainer>
  );
};

export default ShareButton;
