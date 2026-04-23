import { memo, useMemo } from 'react';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import Filter from '@/components/common/Filter/Filter';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetCardList } from '@/hooks/Queries/useClub';
import usePromotionNotification from '@/hooks/Queries/usePromotionNotification';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import SearchBox from '@/pages/MainPage/components/SearchBox/SearchBox';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchIsSearching, useSearchKeyword } from '@/store/useSearchStore';
import { Club } from '@/types/club';
import SubscribeButton from './components/SubscribeButton/SubscribeButton';
import * as Styled from './WebviewMainPage.styles';

const MemoClubCard = memo(ClubCard);

const WebviewMainPage = () => {
  useTrackPageView(PAGE_VIEW.WEBVIEW_MAIN_PAGE);

  const { selectedCategory } = useSelectedCategory();
  const { keyword } = useSearchKeyword();
  const { isSearching } = useSearchIsSearching();
  const searchCategory = isSearching ? 'all' : selectedCategory;

  const { data, error, isLoading, refetch } = useGetCardList({
    keyword,
    recruitmentStatus: 'all',
    category: searchCategory,
    division: 'all',
  });

  const { toggleSubscribe, subscribedClubIds } = useWebviewSubscribe();
  const hasNotification = usePromotionNotification();

  const clubs = data?.clubs || [];
  const totalCount = data?.totalCount ?? clubs.length;
  const isEmpty = !isLoading && clubs.length === 0;

  const clubList = useMemo(() => {
    if (!clubs.length) return null;
    return clubs.map((club: Club) => (
      <MemoClubCard
        key={club.id}
        club={club}
        renderAction={() => (
          <SubscribeButton
            subscribed={subscribedClubIds.has(club.id)}
            onToggle={() => toggleSubscribe(club.id)}
          />
        )}
      />
    ));
  }, [clubs, subscribedClubIds, toggleSubscribe]);

  return (
    <Styled.PageContainer>
      <Styled.SearchBarArea>
        <Styled.LogoImage src={MobileMainIcon} alt='모아동' />
        <SearchBox />
      </Styled.SearchBarArea>
      <Filter hasNotification={hasNotification} />
      <Banner isWebview />
      <Styled.ContentArea>
        <CategoryButtonList />

        <Styled.SectionBar>
          <Styled.SectionTitle>부경대학교 중앙동아리</Styled.SectionTitle>
          <Styled.TotalCount role='status'>
            {`전체 ${isLoading ? 0 : totalCount}개의 동아리`}
          </Styled.TotalCount>
        </Styled.SectionBar>

        <Styled.CardListWrapper>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Styled.EmptyResult>
              동아리 목록을 불러오는 중 문제가 발생했습니다.
              <br />
              <Styled.RetryButton onClick={() => refetch()}>다시 시도</Styled.RetryButton>
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
        </Styled.CardListWrapper>
      </Styled.ContentArea>
    </Styled.PageContainer>
  );
};

export default WebviewMainPage;
