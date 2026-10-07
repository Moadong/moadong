import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';

/**
 * 동아리 전체 목록이 있는 경로.
 *
 * 모바일·앱 웹뷰는 홈이 허브라 목록이 `/clubs`로 빠져 있다.
 * 태블릿·웹은 홈(`/`)이 곧 전체 목록이다.
 */
const useClubListPath = () => {
  const { isMobile } = useDevice();

  return isMobile || isInAppWebView() ? '/clubs' : '/';
};

export default useClubListPath;
