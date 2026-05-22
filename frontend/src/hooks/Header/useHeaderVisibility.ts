import useDevice from '@/hooks/useDevice';
import { DeviceType } from '@/types/device';
import isInAppWebView from '@/utils/isInAppWebView';

const useHeaderVisibility = (showOn?: DeviceType[], hideOn?: DeviceType[]) => {
  const { isMobile, isTablet, isLaptop, isDesktop } = useDevice();
  const isWebView = isInAppWebView();

  const currentTypes: DeviceType[] = [
    isMobile && 'mobile',
    isTablet && 'tablet',
    isLaptop && 'laptop',
    isDesktop && 'desktop',
    isWebView && 'webview',
  ].filter(Boolean) as DeviceType[];

  if (hideOn?.length) return !hideOn.some((t) => currentTypes.includes(t));
  if (showOn?.length) return showOn.some((t) => currentTypes.includes(t));
  return true;
};

export default useHeaderVisibility;
