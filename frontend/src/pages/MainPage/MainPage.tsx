import { useMemo, useState } from 'react';
import Filter from '@/components/common/Filter/Filter';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import useScrollTracking from '@/hooks/Mixpanel/useScrollTracking';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetCardList } from '@/hooks/Queries/useClub';
import usePromotionNotification from '@/hooks/Queries/usePromotionNotification';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import Popup from '@/pages/MainPage/components/Popup/Popup';
import { APP_DOWNLOAD_POPUP } from '@/pages/MainPage/components/Popup/popupConfigs';
import SubscribeButton from '@/pages/MainPage/components/SubscribeButton/SubscribeButton';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchIsSearching, useSearchKeyword } from '@/store/useSearchStore';
import { Club } from '@/types/club';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './MainPage.styles';

const MainPage = () => {
  const inWebview = isInAppWebView();
  useTrackPageView(
    inWebview ? PAGE_VIEW.WEBVIEW_MAIN_PAGE : PAGE_VIEW.MAIN_PAGE,
  );
  useScrollTracking(PAGE_NAME.MAIN);

  const { selectedCategory } = useSelectedCategory();
  const { keyword } = useSearchKeyword();
  const { isSearching } = useSearchIsSearching();
  const recruitmentStatus = 'all';
  const division = 'all';
  const searchCategory = isSearching ? 'all' : selectedCategory;
  const tabs = ['부경대학교 중앙동아리'] as const;
  const [active, setActive] =
    useState<(typeof tabs)[number]>('부경대학교 중앙동아리');

  const { data, error, isLoading, refetch } = useGetCardList({
    keyword,
    recruitmentStatus,
    category: searchCategory,
    division,
  });
  const hasNotification = usePromotionNotification();
  const { subscribedClubIds, toggleSubscribe } = useWebviewSubscribe();

  const clubs = data?.clubs || [];
  const totalCount = data?.totalCount ?? clubs.length;

  const isEmpty = !isLoading && clubs.length === 0;
  const hasData = clubs.length > 0;

  const clubList = useMemo(() => {
    if (!hasData) return null;
    return clubs.map((club: Club, i: number) => (
      <ClubCard
        key={club.id}
        club={club}
        index={i}
        page={inWebview ? PAGE_NAME.WEBVIEW_MAIN : PAGE_NAME.MAIN}
      >
        {inWebview && (
          <SubscribeButton
            subscribed={subscribedClubIds.has(club.id)}
            onToggle={() =>
              toggleSubscribe(club.id, subscribedClubIds.has(club.id))
            }
          />
        )}
      </ClubCard>
    ));
  }, [clubs, hasData, inWebview, subscribedClubIds, toggleSubscribe]);

  return (
    <>
      {!inWebview && <Popup configs={[APP_DOWNLOAD_POPUP]} />}
      <Header />
      <Filter hasNotification={hasNotification} />
      <Banner isWebview={inWebview} />
      <Styled.PageContainer>
        <CategoryButtonList />

        <Styled.SectionBar>
          <Styled.SectionTabs>
            {tabs.map((tab) => (
              <Styled.Tab
                key={tab}
                $active={active === tab}
                onClick={() => setActive(tab)}
              >
                {tab}
              </Styled.Tab>
            ))}
          </Styled.SectionTabs>
          <Styled.TotalCountResult role='status'>
            {`전체 ${isLoading ? 0 : totalCount}개의 동아리`}
          </Styled.TotalCountResult>
        </Styled.SectionBar>
        <Styled.ContentWrapper>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Styled.EmptyResult>
              동아리 목록을 불러오는 중 문제가 발생했습니다.
              <br />
              <Styled.RetryButton onClick={() => refetch()}>
                다시 시도
              </Styled.RetryButton>
            </Styled.EmptyResult>
          ) : isEmpty ? (
            <Styled.EmptyResult>
              앗, 조건에 맞는 동아리가 없어요.
              <br />
              다른 키워드나 조건으로 다시 시도해보세요!
            </Styled.EmptyResult>
          ) : (
            <Styled.CardList>{clubList}</Styled.CardList>
          )}
        </Styled.ContentWrapper>
      </Styled.PageContainer>
      {!inWebview && <Footer />}
    </>
  );
};

export default MainPage;
