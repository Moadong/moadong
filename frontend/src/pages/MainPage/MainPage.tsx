import { useState, useMemo } from 'react';
import { useSearch } from '@/context/SearchContext';
import useTrackPageView from '@/hooks/useTrackPageView';
import { useGetCardList } from '@/hooks/queries/club/useGetCardList';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import StatusRadioButton from '@/pages/MainPage/components/StatusRadioButton/StatusRadioButton';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import { DesktopBannerImageList } from '@/constants/banners';
import { MobileBannerImageList } from '@/constants/banners';
import { Club } from '@/types/club';
import Spinner from '@/components/common/Spinner/Spinner';
import * as Styled from './MainPage.styles';

const MainPage = () => {
  useTrackPageView('MainPage');

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { keyword } = useSearch();
  const recruitmentStatus = isFilterActive ? 'OPEN' : 'all';
  const division = 'all';

  const {
    data: clubs,
    error,
    isLoading,
  } = useGetCardList(keyword, recruitmentStatus, division, selectedCategory);
  const isEmpty = !isLoading && (!clubs || clubs.length === 0);
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
