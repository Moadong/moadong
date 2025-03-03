import React, { useState, useMemo } from 'react';
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
// 1. 검색 기능 추가
// 2. 로딩, 에러, 빈 데이터 UI 추가

const MainPage = () => {
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  // const [keyword, setKeyword] = useState('');

  const recruitmentStatus = isFilterActive ? 'OPEN' : 'all';
  const classification = selectedCategory;
  const division = 'all';

  // 검색 기능 추가 후 ''는 keyword로 대체
  const {
    data: clubs,
    isLoading,
    error,
  } = useGetCardList('', recruitmentStatus, classification, division);

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
        {/* 검색 입력창 추가 */}
        {/* setKeyword()로 검색 키워드 지정해주면 된다 */}
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
