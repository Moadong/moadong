import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import {
  getLastCheckedTime,
  getLatestPromotionTime,
  setLastCheckedTime,
} from '@/pages/PromotionPage/utils/promotionNotification';

const usePromotionNotification = () => {
  const { data } = useGetPromotionArticles();
  const { pathname } = useLocation();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const latestTime = getLatestPromotionTime(data);
    const lastChecked = getLastCheckedTime();

    if (pathname === '/promotions' || pathname === '/webview/promotions') {
      setLastCheckedTime(latestTime);
      setHasNotification(false);
      return;
    }

    if (lastChecked === null || latestTime > lastChecked) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }
  }, [data, pathname]);

  return hasNotification;
};

export default usePromotionNotification;
