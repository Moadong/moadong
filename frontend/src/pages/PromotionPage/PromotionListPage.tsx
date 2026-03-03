import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import isInAppWebView from '@/utils/isInAppWebView';
import Filter from '../MainPage/components/Filter/Filter';
import PromottionGrid from './components/PromotionGrid/PromotionGrid';
import * as Styled from './PromotionListPage.styles';

const PromotionListPage = () => {
  useTrackPageView(PAGE_VIEW.PROMOTION_LIST_PAGE);

  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        {!isInAppWebView() && <Filter alwaysVisible />}
        <Styled.Wrapper>
          <PromottionGrid />
        </Styled.Wrapper>
      </Styled.Container>
      <Footer />
    </>
  );
};

export default PromotionListPage;
