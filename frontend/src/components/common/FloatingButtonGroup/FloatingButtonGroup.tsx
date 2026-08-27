import { useMatch } from 'react-router-dom';
import ScrollToTopIcon from '@/assets/images/icons/scroll_to_top_icon.svg?react';
import ShareFloatingIcon from '@/assets/images/icons/share_floating_icon.svg?react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import useShare from '@/hooks/useShare';
import * as Styled from './FloatingButtonGroup.styles';

const MOADONG_BASE_URL = 'https://www.moadong.com/clubDetail/';

export const FloatingButtonGroup = () => {
  const { isScrollingUp, isDisabled } = useScrollTrigger();
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

  const isClubDetail = !!(matchByName || matchById);

  // 우체통은 남에게 공유할 성격의 화면이 아니고, 목록의 편지 쓰기 버튼과 위치가 겹친다.
  const isFeedback = !!useMatch({ path: '/feedback', end: false });

  const isAdmin = !!useMatch({ path: '/admin', end: false });

  if (isAdmin || isDisabled) return null;

  return (
    <Styled.GroupContainer $isClubDetail={isClubDetail}>
      <Styled.FloatingButton
        type='button'
        $isVisible={isScrollingUp}
        onClick={() => scrollToTop()}
        aria-label='위로 이동하기'
      >
        <ScrollToTopIcon aria-hidden />
      </Styled.FloatingButton>
      {!isFeedback && (
        <Styled.FloatingButton
          type='button'
          $isVisible={true}
          onClick={handlePageShare}
          aria-label='현재 페이지 공유하기'
        >
          <ShareFloatingIcon aria-hidden />
        </Styled.FloatingButton>
      )}
    </Styled.GroupContainer>
  );
};
