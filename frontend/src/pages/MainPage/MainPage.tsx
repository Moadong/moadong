import React, { useState, useMemo } from 'react';
import { useSearch } from '@/context/SearchContext';
import useTrackPageView from '@/hooks/useTrackPageView';
import { useGetCardList } from '@/hooks/queries/club/useGetCardList';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import StatusRadioButton from '@/pages/MainPage/components/StatusRadioButton/StatusRadioButton';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import MainMobileHeader from '@/pages/MainPage/components/MobileHeader/MobileHeader';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import { DesktopBannerImageList } from '@/constants/banners';
import { MobileBannerImageList } from '@/constants/banners';
import { Club } from '@/types/club';
import * as Styled from './MainPage.styles';

const MainPage = () => {
  useTrackPageView('MainPage');

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { keyword } = useSearch();
  const recruitmentStatus = isFilterActive ? 'OPEN' : 'all';
  const division = 'all';

  const { data: clubs, error } = useGetCardList(
    keyword,
    recruitmentStatus,
    division,
    selectedCategory,
  );

  const hasData = clubs && clubs.length > 0;

  const clubList = useMemo(() => {
    if (!hasData) return null;
    return clubs.map((club: Club) => <ClubCard key={club.id} club={club} />);
  }, [clubs, hasData]);

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      <Header />
      <MainMobileHeader />
      <Banner
        desktopBanners={DesktopBannerImageList}
        mobileBanners={MobileBannerImageList}
      />
      <Styled.PageContainer>
        <CategoryButtonList onCategorySelect={setSelectedCategory} />
        <Styled.FilterWrapper>
          <StatusRadioButton onChange={setIsFilterActive} />
        </Styled.FilterWrapper>
        <Styled.ContentWrapper>
          <Styled.CardList>{hasData && clubList}</Styled.CardList>
        </Styled.ContentWrapper>
      </Styled.PageContainer>
      <Footer />
    </>
  );
};

export default MainPage;
