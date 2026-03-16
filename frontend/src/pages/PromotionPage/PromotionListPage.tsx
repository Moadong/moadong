import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import isInAppWebView from '@/utils/isInAppWebView';
import Filter from '../MainPage/components/Filter/Filter';
import PromottionGrid from './components/list/PromotionGrid/PromotionGrid';
import * as Styled from './PromotionListPage.styles';

const PromotionListPage = () => {
  useTrackPageView(PAGE_VIEW.PROMOTION_LIST_PAGE);

  const { data, isLoading, isError } = useGetPromotionArticles();

  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        {!isInAppWebView() && <Filter />}
        <Styled.Wrapper>
          {isLoading && <p>로딩 중...</p>}
          {isError && <p>오류가 발생했습니다.</p>}
          {!isLoading && !isError && <PromottionGrid articles={data || []} />}
        </Styled.Wrapper>
      </Styled.Container>
      <Footer />
    </>
  );
};

export default PromotionListPage;
