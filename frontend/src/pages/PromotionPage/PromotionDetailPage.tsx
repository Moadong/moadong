import { useParams } from 'react-router-dom';
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

  const article = 
    data?.find((item) => item.clubId === promotionId) ?? null;

  return (
    <Styled.Container>
      <PromotionDetailTopBar />

      {isLoading && <Styled.Message>로딩 중...</Styled.Message>}
      {isError && <Styled.Message>오류가 발생했습니다.</Styled.Message>}

      {!isLoading && !isError && !article && (
        <Styled.Message>존재하지 않는 이벤트입니다.</Styled.Message>
      )}

      {!isLoading && !isError && article && (
        <>
          <PromotionTitleSection article={article} />
          <PromotionImageGallery images={article.images} />
          <PromotionInfoSection article={article} />
          <PromotionClubCTA clubId={article.clubId} />
          <RelatedPromotionSection currentClubId={article.clubId} />
        </>
      )}
    </Styled.Container>
  );
};

export default PromotionDetailPage;
