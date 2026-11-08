// 소개 페이지에서 기기에 맞는 앱 스토어를 열고 다운로드 클릭을 Mixpanel로 남기는 훅
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { detectPlatform, getAppStoreLink } from '@/utils/appStoreLink';
import isInAppWebView from '@/utils/isInAppWebView';

/** 버튼이 놓인 자리 (분석 속성). qr은 PC 화면의 QR을 폰으로 찍고 들어온 경우 */
export type AppDownloadLocation = 'hero' | 'feature' | 'footer' | 'qr';

/** PC 화면의 QR에 담는 주소. 폰으로 열면 소개 페이지가 바로 스토어로 넘긴다 */
export const APP_DOWNLOAD_QUERY = { key: 'download', value: 'app' } as const;

/**
 * 스토어로 바로 보낼 수 있는 폰·태블릿인가. 화면 폭이 아니라 기기로 판단한다
 * (큰 폰 가로·아이패드도 포함하고, iPad처럼 맥으로 보이는 기기는 터치 지원으로 가린다)
 */
export const isStoreDevice = () =>
  detectPlatform() !== 'Other' &&
  navigator.maxTouchPoints > 0 &&
  // 앱이 설치돼 있으면 링크가 앱으로 열리는데, 앱 웹뷰 안에서 다시 스토어로 보내면 안 된다
  !isInAppWebView();

/** 마우스로 보는 PC라 폰으로 찍을 설치 QR을 보여 줄 기기인가 */
export const shouldShowInstallQr = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !isStoreDevice();

export const getAppDownloadQrUrl = () =>
  `${window.location.origin}/introduce?${APP_DOWNLOAD_QUERY.key}=${APP_DOWNLOAD_QUERY.value}`;

/**
 * open: 새 탭으로 스토어, redirect: 지금 창을 스토어로(QR로 들어온 경우), qr: PC에서 QR만 띄움
 */
export type AppDownloadAction = 'open' | 'redirect' | 'qr';

const useAppDownload = (location: AppDownloadLocation) => {
  const trackEvent = useMixpanelTrack();

  return (action: AppDownloadAction = 'open') => {
    // 스토어를 연 뒤에 보내면 탭 전환으로 유실될 수 있어 먼저 발송한다
    trackEvent(USER_EVENT.APP_DOWNLOAD_INTRODUCE_CLICKED, {
      location,
      action,
      platform: detectPlatform(),
    });
    if (action === 'qr') return;
    const url = getAppStoreLink();
    if (action === 'open') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.replace(url);
    }
  };
};

export default useAppDownload;
