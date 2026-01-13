import { useMemo, useState } from 'react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import { PAGE_VIEW } from '@/constants/eventName';
import { useGetCardList } from '@/hooks/queries/club/useGetCardList';
import useTrackPageView from '@/hooks/useTrackPageView';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import Popup from '@/pages/MainPage/components/Popup/Popup';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchIsSearching, useSearchKeyword } from '@/store/useSearchStore';
import { Club } from '@/types/club';
import * as Styled from './MainPage.styles';

const MainPage = () => {
  useTrackPageView(PAGE_VIEW.MAIN_PAGE);

  const { selectedCategory } = useSelectedCategory();
  const { keyword } = useSearchKeyword();
  const { isSearching } = useSearchIsSearching();
  const recruitmentStatus = 'all';
  const division = 'all';
  const searchCategory = isSearching ? 'all' : selectedCategory;
  const tabs = ['부경대학교 중앙동아리'] as const;
  const [active, setActive] =
    useState<(typeof tabs)[number]>('부경대학교 중앙동아리');

  const { data, error, isLoading } = useGetCardList({
    keyword,
    recruitmentStatus,
    category: searchCategory,
    division,
  });

  const clubs = data?.clubs || [];
  const totalCount = data?.totalCount ?? clubs.length;

  const isEmpty = !isLoading && clubs.length === 0;
  const hasData = clubs.length > 0;

  const clubList = useMemo(() => {
    if (!hasData) return null;
    return clubs.map((club: Club) => <ClubCard key={club.id} club={club} />);
  }, [clubs, hasData]);

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      <Popup />
      <Header />
      <Banner />
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
      <Footer />
    </>
  );
};

export default MainPage;
