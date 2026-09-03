import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import useScrollTracking from '@/hooks/Mixpanel/useScrollTracking';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetCardList } from '@/hooks/Queries/useClub';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import SubscribeButton from '@/pages/MainPage/components/SubscribeButton/SubscribeButton';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchIsSearching, useSearchKeyword } from '@/store/useSearchStore';
import { Club } from '@/types/club';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './ClubListPage.styles';

const ClubListPage = () => {
  const inWebview = isInAppWebView();
  useTrackPageView(PAGE_VIEW.CLUB_LIST_PAGE);
  useScrollTracking(PAGE_NAME.CLUB_LIST);

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
  const navigate = useNavigate();
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
        page={PAGE_NAME.CLUB_LIST}
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
                PAGE_NAME.CLUB_LIST,
              )
            }
          />
        )}
      </ClubCard>
    ));
  }, [clubs, hasData, inWebview, subscribedClubIds, toggleSubscribe]);

  return (
    <>
      <Header />
      <Styled.PageContainer>
        <CategoryButtonList />

        <Styled.SectionBar>
          <Styled.SectionTitle>부경대학교 중앙동아리</Styled.SectionTitle>
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

export default ClubListPage;
