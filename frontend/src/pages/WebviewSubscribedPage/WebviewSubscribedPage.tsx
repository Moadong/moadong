import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetCardList } from '@/hooks/Queries/useClub';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import SubscribeButton from '@/pages/WebviewMainPage/components/SubscribeButton/SubscribeButton';
import { Club } from '@/types/club';
import { requestNavigateWebview } from '@/utils/webviewBridge';
import * as Styled from './WebviewSubscribedPage.styles';

const MemoClubCard = memo(ClubCard);

const WebviewSubscribedPage = () => {
  useTrackPageView(PAGE_VIEW.WEBVIEW_SUBSCRIBED_PAGE);

  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetCardList({
    keyword: '',
    recruitmentStatus: 'all',
    category: 'all',
    division: 'all',
  });
  const { toggleSubscribe, subscribedClubIds } = useWebviewSubscribe();

  const handleCardClick = useCallback((club: Club) => {
    requestNavigateWebview(`club/${club.id}`);
  }, []);

  const subscribedClubs = useMemo(
    () => (data?.clubs ?? []).filter((club) => subscribedClubIds.has(club.id)),
    [data, subscribedClubIds],
  );

  const clubList = useMemo(
    () =>
      subscribedClubs.map((club: Club, i: number) => (
        <MemoClubCard
          key={club.id}
          club={club}
          index={i}
          page={PAGE_NAME.WEBVIEW_SUBSCRIBED}
          onCardClick={handleCardClick}
        >
          <SubscribeButton
            subscribed={subscribedClubIds.has(club.id)}
            onToggle={() =>
              toggleSubscribe(club.id, subscribedClubIds.has(club.id))
            }
          />
        </MemoClubCard>
      )),
    [subscribedClubs, subscribedClubIds, toggleSubscribe, handleCardClick],
  );

  return (
    <Styled.PageContainer>
      <Styled.SectionBar>
        <Styled.SectionTitle>구독한 동아리</Styled.SectionTitle>
        <Styled.TotalCount role='status'>
          {`전체 ${isLoading ? 0 : subscribedClubs.length}개`}
        </Styled.TotalCount>
      </Styled.SectionBar>

      <Styled.CardListWrapper>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Styled.EmptyResult>
            동아리 목록을 불러오는 중 문제가 발생했습니다.
            <br />
            <Styled.ActionButton onClick={() => refetch()}>
              다시 시도
            </Styled.ActionButton>
          </Styled.EmptyResult>
        ) : subscribedClubs.length === 0 ? (
          <Styled.EmptyResult>
            아직 구독한 동아리가 없어요.
            <br />
            관심 있는 동아리를 구독해보세요!
            <br />
            <Styled.ActionButton onClick={() => navigate('/webview/main')}>
              동아리 보러 가기
            </Styled.ActionButton>
          </Styled.EmptyResult>
        ) : (
          <Styled.CardList>{clubList}</Styled.CardList>
        )}
      </Styled.CardListWrapper>
    </Styled.PageContainer>
  );
};

export default WebviewSubscribedPage;
