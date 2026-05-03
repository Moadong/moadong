import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import usePromotionNotification from '@/hooks/Queries/usePromotionNotification';
import isInAppWebView from '@/utils/isInAppWebView';
import Filter from '../../components/common/Filter/Filter';
import PromottionGrid from './components/list/PromotionGrid/PromotionGrid';
import * as Styled from './PromotionListPage.styles';

const PromotionListPage = () => {
  useTrackPageView(PAGE_VIEW.PROMOTION_LIST_PAGE);

  const { data, isLoading, isError } = useGetPromotionArticles();
  const hasNotification = usePromotionNotification();
  const inAppWebView = isInAppWebView();

  const content = (
    <Styled.Wrapper>
      {isLoading && <p>로딩 중...</p>}
      {isError && <p>오류가 발생했습니다.</p>}
      {!isLoading && !isError && data?.length === 0 && (
        <Styled.EmptyText>등록된 이벤트가 없어요.</Styled.EmptyText>
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <PromottionGrid articles={data} />
      )}
    </Styled.Wrapper>
  );

  if (inAppWebView) {
    return (
      <Styled.Container>
        <Filter hasNotification={hasNotification} />
        {content}
      </Styled.Container>
    );
  }

  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        <Filter hasNotification={hasNotification} />
        {content}
      </Styled.Container>
      <Footer />
    </>
  );
};

export default PromotionListPage;
