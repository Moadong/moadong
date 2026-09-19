import { lazy, Suspense } from 'react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import isInAppWebView from '@/utils/isInAppWebView';

// 일반 사용자 번들에 들어가지 않게 별도 청크로 분리한다.
// 배포 직후 옛 탭에서 청크 404가 나도 앱 전체 에러 화면으로 번지지 않게 툴바만 포기한다.
const Agentation = lazy(() =>
  import('agentation')
    .then((m) => ({ default: m.Agentation }))
    .catch(() => ({ default: () => null })),
);

/** agentation이 자기 설정을 담아 두는 키. 우리 STORAGE_KEYS가 아니라 그쪽 소유다 */
const TOOLBAR_SETTINGS_KEY = 'feedback-toolbar-settings';

// `?design=1`로 켜고 `?design=0`으로 끈다. 쿼리가 없으면 저장된 값을 따른다.
// 저장소가 막힌 브라우저(사파리 프라이빗 등)에서 setItem이 던지면 툴바만 포기한다.
const resolveEnabled = () => {
  try {
    const flag = new URLSearchParams(window.location.search).get('design');
    if (flag === '1') localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    if (flag === '0') localStorage.removeItem(STORAGE_KEYS.DESIGN_FEEDBACK);
    const enabled = localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK) === '1';
    // 기본값 standard로는 프로덕션 빌드에서 요소를 특정할 단서가 남지 않는다. detailed라야
    // `**Classes:**` 줄에 styled 파일명·변수명이 온전히 실린다. 직접 바꾼 설정은 덮지 않는다.
    if (enabled && localStorage.getItem(TOOLBAR_SETTINGS_KEY) === null) {
      localStorage.setItem(
        TOOLBAR_SETTINGS_KEY,
        JSON.stringify({ outputDetail: 'detailed' }),
      );
    }
    return enabled;
  } catch {
    return false;
  }
};

const DesignFeedbackToolbar = () => {
  const enabled = resolveEnabled();
  if (!enabled || isInAppWebView()) return null;

  return (
    <Suspense fallback={null}>
      <Agentation />
    </Suspense>
  );
};

export default DesignFeedbackToolbar;
