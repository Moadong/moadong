import React, { useState, useMemo } from 'react';
import { useSearch } from '@/context/SearchContext';
import useTrackPageView from '@/hooks/useTrackPageView';
import { useGetCardList } from '@/hooks/queries/club/useGetCardList';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import StatusRadioButton from '@/pages/MainPage/components/StatusRadioButton/StatusRadioButton';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import { BannerImageList } from '@/utils/banners';
import { Club } from '@/types/club';
import * as Styled from './MainPage.styles';
import MainMobileHeader from '@/pages/MainPage/components/MobileHeader/MobileHeader';

//Todo
// - 로딩, 에러, 빈 데이터 UI 추가

const MainPage = () => {
  useTrackPageView('MainPage');

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { keyword } = useSearch();
  const recruitmentStatus = isFilterActive ? 'OPEN' : 'all';
  const division = 'all';

  const {
    data: clubs,
    isLoading,
    error,
  } = useGetCardList(keyword, recruitmentStatus, division, selectedCategory);

  const hasData = clubs && clubs.length > 0;

  const clubList = useMemo(() => {
    if (!hasData) return null;
    return clubs.map((club: Club) => <ClubCard key={club.id} club={club} />);
  }, [clubs, hasData]);

  return (
    <>
      <Header />
      <MainMobileHeader />
      <Banner banners={BannerImageList} />
      <Styled.PageContainer>
        <CategoryButtonList onCategorySelect={setSelectedCategory} />
        <Styled.FilterWrapper>
          <StatusRadioButton onChange={setIsFilterActive} />
        </Styled.FilterWrapper>
        <Styled.ContentWrapper>
          <Styled.CardList>
            {/* 로딩 UI */}
            {/*isLoading && <Loading />*/}
            {/* 에러 UI */}
            {/*error && <ErrorMessage />*/}
            {/* 빈 데이터 UI */}
            {/*!isLoading && !error && !hasData && <EmptyState />*/}
            {!isLoading && !error && hasData && clubList}
          </Styled.CardList>
        </Styled.ContentWrapper>
      </Styled.PageContainer>
      <Footer />
    </>
  );
};

export default MainPage;
