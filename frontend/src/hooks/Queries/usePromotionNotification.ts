import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import {
  countNewPromotions,
  getLastCheckedTime,
  getLatestPromotionTime,
  setLastCheckedTime,
} from '@/pages/PromotionPage/utils/promotionNotification';

/** 0이면 표시 없음, 'dot'이면 첫 방문 점, 그 외에는 마지막 확인 이후 새로 생성된 글 수 */
const usePromotionNotification = (): number | 'dot' => {
  const { data } = useGetPromotionArticles();
  const { pathname } = useLocation();
  const [notification, setNotification] = useState<number | 'dot'>(0);

  useEffect(() => {
    if (!data) return;

    // 서버 글이 하나도 없으면(빈 배열·목업만) 0이다. 목업 시각을 저장하면 실제 새 글이 가려진다
    const latestTime = getLatestPromotionTime(data);
    if (latestTime === 0) {
      setNotification(0);
      return;
    }

    if (pathname === '/promotions') {
      setLastCheckedTime(latestTime);
      setNotification(0);
      return;
    }

    const lastChecked = getLastCheckedTime();
    if (lastChecked === null) {
      setNotification('dot');
      return;
    }

    setNotification(countNewPromotions(data, lastChecked));
  }, [data, pathname]);

  return notification;
};

export default usePromotionNotification;
