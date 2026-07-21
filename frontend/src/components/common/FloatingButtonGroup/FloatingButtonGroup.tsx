import { useMatch } from 'react-router-dom';
import scrollToTopIcon from '@/assets/images/icons/scroll_to_top_icon.svg';
import shareFloatingIcon from '@/assets/images/icons/share_floating_icon.svg';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import useShare from '@/hooks/useShare';
import * as Styled from './FloatingButtonGroup.styles';

const MOADONG_BASE_URL = 'https://www.moadong.com/clubDetail/';

export const FloatingButtonGroup = () => {
  const { isScrollingUp } = useScrollTrigger();
  const { scrollToTop } = useScrollTo();
  const { handleShare } = useShare();
  const trackEvent = useMixpanelTrack();

  const matchByName = useMatch('/clubDetail/@:clubName');
  const matchById = useMatch('/clubDetail/:clubId');

  const clubIdentifier =
    matchByName?.params.clubName ?? matchById?.params.clubId;

  const { data: clubDetail } = useGetClubDetail(clubIdentifier ?? '');

  const handlePageShare = async () => {
    if (clubDetail) {
      const url = `${MOADONG_BASE_URL}@${clubDetail.name}`;
      const text = `지금 모아동에서 ${clubDetail.name} 동아리를 확인해보세요!\n${url}`;

      await handleShare({ title: clubDetail.name, text, url });

      trackEvent(USER_EVENT.SHARE_BUTTON_CLICKED, {
        clubName: clubDetail.name,
      });
      return;
    }

    const url = window.location.href;
    await handleShare({ title: document.title, text: url, url });
  };

  return (
    <Styled.GroupContainer>
      <Styled.FloatingButton
        type='button'
        $isVisible={isScrollingUp}
        onClick={() => scrollToTop()}
        aria-label='위로 이동하기'
      >
        <img src={scrollToTopIcon} alt='위로 이동' />
      </Styled.FloatingButton>
      <Styled.FloatingButton
        type='button'
        $isVisible={true}
        onClick={handlePageShare}
        aria-label='현재 페이지 공유하기'
      >
        <img src={shareFloatingIcon} alt='공유하기' />
      </Styled.FloatingButton>
    </Styled.GroupContainer>
  );
};
