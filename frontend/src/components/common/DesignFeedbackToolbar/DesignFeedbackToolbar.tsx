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

// `?design=1`로 켜고 `?design=0`으로 끈다. 쿼리가 없으면 저장된 값을 따른다.
// 저장소가 막힌 브라우저(사파리 프라이빗 등)에서 setItem이 던지면 툴바만 포기한다.
const resolveEnabled = () => {
  try {
    const flag = new URLSearchParams(window.location.search).get('design');
    if (flag === '1') localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    if (flag === '0') localStorage.removeItem(STORAGE_KEYS.DESIGN_FEEDBACK);
    return localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK) === '1';
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
