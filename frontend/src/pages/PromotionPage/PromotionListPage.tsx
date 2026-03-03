import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import isInAppWebView from '@/utils/isInAppWebView';
import Filter from '../MainPage/components/Filter/Filter';
import * as Styled from './PromotionListPage.styles';

const PromotionListPage = () => {
  useTrackPageView(PAGE_VIEW.PROMOTION_LIST_PAGE);

  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        {!isInAppWebView() && <Filter alwaysVisible />}
        <Styled.Wrapper>
          <h1>홍보 목록 페이지</h1>
          <p>여기에 홍보 카드 2열로 배치 예정</p>
        </Styled.Wrapper>
      </Styled.Container>
      <Footer />
    </>
  );
};

export default PromotionListPage;
