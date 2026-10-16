export const ANALYTICS_VISITOR_ID_KEY = 'moadong.analytics.visitor_id';

export const createAnalyticsId = (prefix: string) => {
  const randomId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${randomId}`;
};

export const getAnalyticsVisitorId = () => {
  if (typeof window === 'undefined') return undefined;

  try {
    const storedVisitorId = window.localStorage.getItem(
      ANALYTICS_VISITOR_ID_KEY,
    );
    if (storedVisitorId) return storedVisitorId;

    const visitorId = createAnalyticsId('visitor');
    window.localStorage.setItem(ANALYTICS_VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch {
    return undefined;
  }
};
