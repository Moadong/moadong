import { mainRedesignExperiment } from '@/experiments/definitions';
import { useExperimentVariant } from '@/hooks/Experiment/useExperimentVariant';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';

/**
 * 동아리 전체 목록이 있는 경로.
 *
 * 목록이 `/clubs`로 빠진 건 개편을 받은 모바일·앱뿐이다. 태블릿·웹과 개편
 * 실험의 control은 홈(`/`)이 곧 전체 목록이므로 그쪽으로 보내야 한다.
 */
const useClubListPath = () => {
  const { isMobile } = useDevice();
  const variant = useExperimentVariant(mainRedesignExperiment);
  const isNarrow = isMobile || isInAppWebView();

  return isNarrow && variant === 'treatment' ? '/clubs' : '/';
};

export default useClubListPath;
