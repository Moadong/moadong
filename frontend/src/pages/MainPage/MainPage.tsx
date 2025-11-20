import { useState, useMemo } from 'react';
import { useSearchKeyword, useSearchIsSearching } from '@/store/useSearchStore';
import { useSelectedCategory } from '@/store/useCategoryStore';
import useTrackPageView from '@/hooks/useTrackPageView';
import { useGetCardList } from '@/hooks/queries/club/useGetCardList';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import Banner from '@/pages/MainPage/components/Banner/Banner';
import { DesktopBannerImageList } from '@/constants/banners';
import { MobileBannerImageList } from '@/constants/banners';
import { Club } from '@/types/club';
import Spinner from '@/components/common/Spinner/Spinner';
import * as Styled from './MainPage.styles';
import { PAGE_VIEW } from '@/constants/eventName';

const MainPage = () => {
  useTrackPageView(PAGE_VIEW.MAIN_PAGE);

  const { selectedCategory } = useSelectedCategory();
  const { keyword } = useSearchKeyword();
  const { isSearching } = useSearchIsSearching();
  const recruitmentStatus = 'all';
  const division = 'all';
  const searchCategory = isSearching ? 'all' : selectedCategory;
  const tabs = ['중앙동아리'] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>('중앙동아리');
  // TODO: 추후 확정되면 DivisionKey(중동/가동/과동) 같은 타입을
  // types/club.ts에 정의해서 tabs 관리하도록 리팩터링하기

  const { data, error, isLoading } = useGetCardList({
    keyword,
    recruitmentStatus,
    category: searchCategory,
    division,
  });

  const clubs = data?.clubs || [];
  // const totalCount = data?.totalCount || 0; // ⚠️ 백엔드 업데이트 전까지 임시 주석
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
      <Header />
      <Banner
        desktopBanners={DesktopBannerImageList}
        mobileBanners={MobileBannerImageList}
      />
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
