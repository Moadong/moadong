import React, { useEffect, useRef } from 'react';
import * as Styled from './ShareButton.styles';
import ShareIcon from '@/assets/images/icons/share_icon.svg';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';

interface ShareButtonProps {
  clubId: string;
}

const ShareButton = ({ clubId }: ShareButtonProps) => {
  const kakaoBtnRef = useRef<HTMLDivElement>(null);
  const { data: clubDetail } = useGetClubDetail(clubId as string);
  const trackEvent = useMixpanelTrack();

  useEffect(() => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오 SDK가 아직 준비되지 않았습니다.');
      return;
    }

    if (!clubDetail) return;

    if (kakaoBtnRef.current && kakaoBtnRef.current.childElementCount === 0) {
      window.Kakao.Share.createDefaultButton({
        container: kakaoBtnRef.current,
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
    }
  }, [clubId, clubDetail]);

  return (
    <Styled.ShareButtonContainer
      ref={kakaoBtnRef}
      onClick={() => {
        trackEvent(`${clubDetail?.name} 공유하기 버튼 클릭`);
      }}
    >
      <img src={ShareIcon} alt='카카오톡 공유' />
    </Styled.ShareButtonContainer>
  );
};

export default ShareButton;
