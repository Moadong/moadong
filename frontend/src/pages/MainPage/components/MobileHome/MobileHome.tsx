import { useNavigate } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_NAME } from '@/constants/eventName';
import { useGetCardList } from '@/hooks/Queries/useClub';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import EventSection from '@/pages/MainPage/components/EventSection/EventSection';
import HomeHeader from '@/pages/MainPage/components/HomeHeader/HomeHeader';
import MoreButton from '@/pages/MainPage/components/MoreButton/MoreButton';
import SubscribeButton from '@/pages/MainPage/components/SubscribeButton/SubscribeButton';
import { Club } from '@/types/club';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './MobileHome.styles';

const PREVIEW_COUNT = 5;
const CLUB_LIST_PATH = '/clubs';

/** 개편된 홈. 모바일(≤500px)과 앱 웹뷰에서만 렌더된다. */
const MobileHome = () => {
  const inWebview = isInAppWebView();
  const navigate = useNavigate();
  const { subscribedClubIds, toggleSubscribe } = useWebviewSubscribe();

  const { data, isLoading } = useGetCardList({
    keyword: '',
    recruitmentStatus: 'all',
    category: 'all',
    division: 'all',
  });

  const previewClubs = (data?.clubs ?? []).slice(0, PREVIEW_COUNT);

  return (
    <>
      <HomeHeader />
      <Styled.HeaderSpacer />
      <Banner isWebview={inWebview} />
      <Styled.PageContainer>
        <Styled.Section>
          <Styled.SectionTitle>중앙동아리 카테고리</Styled.SectionTitle>
          <CategoryButtonList
            sticky={false}
            onSelect={() => navigate(CLUB_LIST_PATH)}
          />
        </Styled.Section>

        <Styled.Section>
          {isLoading ? (
            <Spinner />
          ) : (
            <Styled.CardList>
              {previewClubs.map((club: Club, index: number) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  index={index}
                  page={inWebview ? PAGE_NAME.WEBVIEW_MAIN : PAGE_NAME.MAIN}
                  onCardClick={
                    inWebview
                      ? (c) =>
                          navigate(
                            `/clubDetail/@${encodeURIComponent(c.name)}?is_subscribed=${subscribedClubIds.has(c.id)}`,
                          )
                      : undefined
                  }
                >
                  {inWebview && (
                    <SubscribeButton
                      subscribed={subscribedClubIds.has(club.id)}
                      onToggle={() =>
                        toggleSubscribe(
                          club.id,
                          subscribedClubIds.has(club.id),
                          PAGE_NAME.WEBVIEW_MAIN,
                        )
                      }
                    />
                  )}
                </ClubCard>
              ))}
            </Styled.CardList>
          )}
          <MoreButton
            label='중앙동아리 전체보기'
            to={CLUB_LIST_PATH}
            section='club'
          />
        </Styled.Section>

        <EventSection />
      </Styled.PageContainer>
      {!inWebview && <Footer />}
    </>
  );
};

export default MobileHome;
