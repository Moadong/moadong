import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetCardList } from '@/hooks/Queries/useClub';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import SubscribeButton from '@/pages/MainPage/components/SubscribeButton/SubscribeButton';
import { Club } from '@/types/club';
import { getAppStoreLink } from '@/utils/appStoreLink';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './SubscriptionsPage.styles';

const SubscribedClubs = () => {
  const navigate = useNavigate();
  const { subscribedClubIds, toggleSubscribe } = useWebviewSubscribe();
  const { data, isLoading, error, refetch } = useGetCardList({
    keyword: '',
    recruitmentStatus: 'all',
    category: 'all',
    division: 'all',
  });

  const subscribedClubs = useMemo(
    () => (data?.clubs ?? []).filter((club) => subscribedClubIds.has(club.id)),
    [data, subscribedClubIds],
  );

  return (
    <Styled.Container>
      <Styled.Title>구독</Styled.Title>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Styled.Empty>
          구독한 동아리 목록을 불러오지 못했어요.
          <Styled.CtaButton onClick={() => refetch()}>
            다시 시도
          </Styled.CtaButton>
        </Styled.Empty>
      ) : subscribedClubs.length === 0 ? (
        <Styled.Empty>
          아직 구독한 동아리가 없어요.
          <br />
          관심있는 동아리를 구독하고 새 소식을 받아보세요.
          <Styled.CtaButton onClick={() => navigate('/')}>
            홈으로 가기
          </Styled.CtaButton>
        </Styled.Empty>
      ) : (
        <Styled.CardList>
          {subscribedClubs.map((club: Club, index: number) => (
            <ClubCard
              key={club.id}
              club={club}
              index={index}
              page={PAGE_NAME.SUBSCRIPTIONS}
              onCardClick={(c) =>
                navigate(
                  `/clubDetail/@${encodeURIComponent(c.name)}?is_subscribed=true`,
                )
              }
            >
              <SubscribeButton
                subscribed={subscribedClubIds.has(club.id)}
                onToggle={() =>
                  toggleSubscribe(club.id, subscribedClubIds.has(club.id))
                }
              />
            </ClubCard>
          ))}
        </Styled.CardList>
      )}
    </Styled.Container>
  );
};

const SubscriptionsPage = () => {
  useTrackPageView(PAGE_VIEW.SUBSCRIPTIONS_PAGE);

  if (!isInAppWebView()) {
    return (
      <Styled.Container>
        <Styled.Title>구독</Styled.Title>
        <Styled.Empty>
          구독 기능은 모아동 앱에서 이용할 수 있어요.
          <Styled.CtaButton
            onClick={() =>
              window.open(getAppStoreLink(), '_blank', 'noopener,noreferrer')
            }
          >
            앱 다운로드
          </Styled.CtaButton>
        </Styled.Empty>
      </Styled.Container>
    );
  }

  return <SubscribedClubs />;
};

export default SubscriptionsPage;
