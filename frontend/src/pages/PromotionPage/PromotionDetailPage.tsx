import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useParams } from 'react-router-dom';

const PromotionDetailPage = () => {
  useTrackPageView(PAGE_VIEW.PROMOTION_DETAIL_PAGE);
  const { promotionId } = useParams();

  return (
    <div>
      <h1>홍보 상세 페이지</h1>
      <p>홍보 ID: {promotionId}</p>
      <p>여기에 홍보 상세 정보 들어올 예정</p>
    </div>
  );
};

export default PromotionDetailPage;
