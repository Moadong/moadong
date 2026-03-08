import { useParams } from 'react-router-dom';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import PromotionClubCTA from './components/detail/PromotionClubCTA/PromotionClubCTA';
import PromotionDetailTopBar from './components/detail/PromotionDetailTopBar/PromotionDetailTopBar';
import PromotionImageGallery from './components/detail/PromotionImageGallery/PromotionImageGallery';
import PromotionInfoSection from './components/detail/PromotionInfoSection/PromotionInfoSection';
import PromotionTitleSection from './components/detail/PromotionTitleSection/PromotionTitleSection';
import RelatedPromotionSection from './components/detail/RelatedPromotionSection/RelatedPromotionSection';
import * as Styled from './PromotionDetailPage.styles';

const PromotionDetailPage = () => {
  useTrackPageView(PAGE_VIEW.PROMOTION_DETAIL_PAGE);

  const { promotionId } = useParams<{ promotionId: string }>();
  const { data, isLoading, isError } = useGetPromotionArticles();

  const article = data?.find((item) => item.clubId === promotionId) ?? null;

  return (
    <>
      <Styled.DesktopHeader>
        <Header hideOn={['webview']} />
      </Styled.DesktopHeader>
      <Styled.Container>
        <Styled.MobileTopBar>
          <PromotionDetailTopBar />
        </Styled.MobileTopBar>

        {isLoading && <Styled.Message>로딩 중...</Styled.Message>}
        {isError && <Styled.Message>오류가 발생했습니다.</Styled.Message>}

        {!isLoading && !isError && !article && (
          <Styled.Message>존재하지 않는 이벤트입니다.</Styled.Message>
        )}

        {!isLoading && !isError && article && (
          <>
            <Styled.TitleWrapper>
              <PromotionTitleSection article={article} />
            </Styled.TitleWrapper>

            <Styled.ContentWrapper>
              <Styled.LeftSection>
                <PromotionInfoSection article={article} />
                <PromotionClubCTA clubId={article.clubId} />
                <RelatedPromotionSection
                  currentClubId={article.clubId}
                  articles={article ? data || [] : []}
                />
              </Styled.LeftSection>

              <Styled.RightSection>
                <PromotionImageGallery images={article.images} />
              </Styled.RightSection>
            </Styled.ContentWrapper>
          </>
        )}
      </Styled.Container>
      <Footer />
    </>
  );
};

export default PromotionDetailPage;
