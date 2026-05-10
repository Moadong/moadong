type TrackEventFn = (
  eventName: string,
  properties?: Record<string, any>,
) => void;

export interface PopupConfig {
  id: string;
  storageKey: string;
  sessionKey: string;
  daysToHide?: number;
  image: string;
  imageAlt: string;
  mobileOnly?: boolean;
  onImageClick?: (trackEvent: TrackEventFn) => void;
}

export const DAYS_TO_HIDE = 7;

export const isPopupHidden = (config: PopupConfig): boolean => {
  if (sessionStorage.getItem(config.sessionKey)) return true;

  const hiddenDate = localStorage.getItem(config.storageKey);
  if (!hiddenDate) return false;

  const daysSinceHidden =
    (Date.now() - parseInt(hiddenDate)) / (1000 * 60 * 60 * 24);
  const daysToHide =
    config.daysToHide !== undefined ? config.daysToHide : DAYS_TO_HIDE;
  return daysSinceHidden < daysToHide;
};
