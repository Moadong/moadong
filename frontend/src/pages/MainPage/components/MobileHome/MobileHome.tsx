import { useNavigate } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_NAME } from '@/constants/eventName';
import { useGetCardList } from '@/hooks/Queries/useClub';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import EventSection from '@/pages/MainPage/components/EventSection/EventSection';
import MoreButton from '@/pages/MainPage/components/MoreButton/MoreButton';
import SubscribeButton from '@/pages/MainPage/components/SubscribeButton/SubscribeButton';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchStore } from '@/store/useSearchStore';
import { Club } from '@/types/club';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './MobileHome.styles';

const PREVIEW_COUNT = 5;
const CLUB_LIST_PATH = '/clubs';

/**
 * 모바일(≤500px)·앱 웹뷰의 홈. 동아리는 미리보기만 두고 전체 목록은 `/clubs`로,
 * 아래에 홍보 카드를 둔다. 태블릿·웹은 `MainContent`(전체 목록)가 홈이다.
 */
const MobileHome = () => {
  const inWebview = isInAppWebView();
  const navigate = useNavigate();
  const { subscribedClubIds, toggleSubscribe } = useWebviewSubscribe();
  const { setSelectedCategory } = useSelectedCategory();

  const { data, isLoading } = useGetCardList({
    keyword: '',
    recruitmentStatus: 'all',
    category: 'all',
    division: 'all',
  });

  const previewClubs = (data?.clubs ?? []).slice(0, PREVIEW_COUNT);

  return (
    <>
      <Header />
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
                  page={PAGE_NAME.MAIN}
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
                          PAGE_NAME.MAIN,
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
            onClick={() => {
              // 이전에 고른 카테고리·검색어가 남아 있으면 '전체'가 아니게 된다
              setSelectedCategory('all');
              useSearchStore.getState().resetSearch();
            }}
          />
        </Styled.Section>

        <EventSection />
      </Styled.PageContainer>
      {!inWebview && <Footer />}
    </>
  );
};

export default MobileHome;
