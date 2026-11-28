import { useRef } from 'react';
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
import SubscribeButton from '@/pages/MainPage/components/SubscribeButton/SubscribeButton';
import partitionClubsByRecruitment from '@/pages/MainPage/utils/partitionClubsByRecruitment';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchIsSearching, useSearchKeyword } from '@/store/useSearchStore';
import { Club } from '@/types/club';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './MainContent.styles';

interface ClubSection {
  key: string;
  title: string;
  clubs: Club[];
  variant: 'default' | 'compact';
  /** 이 구간 첫 카드의 화면 순서. 앞 구간의 카드 수만큼 이어 센다 */
  startIndex: number;
}

/** 메인(`/`)의 본문. 홈이 곧 동아리 전체 목록이다. */
const MainContent = () => {
  const inWebview = isInAppWebView();
  const { selectedCategory } = useSelectedCategory();
  const { keyword } = useSearchKeyword();
  const { isSearching } = useSearchIsSearching();
  const searchCategory = isSearching ? 'all' : selectedCategory;
  const listAnchorRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, refetch } = useGetCardList({
    keyword,
    recruitmentStatus: 'all',
    category: searchCategory,
    division: 'all',
  });
  const navigate = useNavigate();
  const { subscribedClubIds, toggleSubscribe } = useWebviewSubscribe();

  const clubs = data?.clubs ?? [];
  const totalCount = data?.totalCount ?? clubs.length;

  const isEmpty = !isLoading && clubs.length === 0;
  const isBrowsing = keyword.trim() === '';

  // 검색은 서버 관련도 순서를 지키려고 묶지 않는다. 둘러보기만 모집 상태로 나눈다
  const { recruiting, closed } = partitionClubsByRecruitment(clubs);
  const sections: ClubSection[] = isBrowsing
    ? [
        {
          key: 'recruiting',
          title: '지금 모집 중',
          clubs: recruiting,
          variant: 'default',
          startIndex: 0,
        },
        {
          key: 'closed',
          title: '모집 마감',
          clubs: closed,
          variant: 'compact',
          startIndex: recruiting.length,
        },
      ]
    : [
        {
          key: 'search',
          title: '검색 결과',
          clubs,
          variant: 'default',
          startIndex: 0,
        },
      ];
  const visibleSections = sections.filter(
    (section) => section.clubs.length > 0,
  );
  const serverIndexById = new Map(clubs.map((club, i) => [club.id, i]));

  const totalCountLabel = (() => {
    if (!isBrowsing) return `${totalCount}곳`;
    if (searchCategory === 'all') return `부경대 중앙동아리 ${totalCount}곳`;
    return `${searchCategory} ${totalCount}곳`;
  })();

  /** 사용자가 목록 안쪽까지 내려와 있을 때만 목록 처음으로 올린다. 첫 화면에서는 움직이지 않는다 */
  const scrollToListStart = () => {
    const anchor = listAnchorRef.current;
    if (!anchor) return;

    const fixedAreaBottom = parseFloat(
      getComputedStyle(anchor).scrollMarginTop,
    );
    if (anchor.getBoundingClientRect().top < fixedAreaBottom) {
      anchor.scrollIntoView({ block: 'start' });
    }
  };

  const renderClubCard = (
    club: Club,
    displayIndex: number,
    variant: ClubSection['variant'],
  ) => (
    <ClubCard
      key={club.id}
      club={club}
      index={displayIndex}
      serverIndex={serverIndexById.get(club.id)}
      variant={variant}
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
  );

  return (
    <>
      <Header />
      <Styled.HeaderSpacer />
      <Banner isWebview={inWebview} />
      <Styled.PageContainer>
        <Styled.VisuallyHiddenTitle>
          부경대학교 중앙동아리
        </Styled.VisuallyHiddenTitle>
        <CategoryButtonList onSelect={scrollToListStart} />
        <Styled.ListAnchor ref={listAnchorRef} />

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
            visibleSections.map((section, sectionIndex) => (
              <Styled.Section
                key={section.key}
                aria-labelledby={`club-section-${section.key}`}
              >
                <Styled.SectionHeader $variant={section.variant}>
                  <Styled.SectionTitle id={`club-section-${section.key}`}>
                    {section.title}
                    <Styled.SectionCount>{`${section.clubs.length}곳`}</Styled.SectionCount>
                  </Styled.SectionTitle>
                  {sectionIndex === 0 && (
                    <Styled.TotalCountResult role='status'>
                      {totalCountLabel}
                    </Styled.TotalCountResult>
                  )}
                </Styled.SectionHeader>
                <Styled.CardList $variant={section.variant}>
                  {section.clubs.map((club, i) =>
                    renderClubCard(
                      club,
                      section.startIndex + i,
                      section.variant,
                    ),
                  )}
                </Styled.CardList>
              </Styled.Section>
            ))
          )}
        </Styled.ContentWrapper>
      </Styled.PageContainer>
      {!inWebview && <Footer />}
    </>
  );
};

export default MainContent;
