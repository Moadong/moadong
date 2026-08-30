import mixpanel from 'mixpanel-browser';
import { DIAGNOSTIC_EVENT } from '@/constants/eventName';
import isInAppWebView from '@/utils/isInAppWebView';

/**
 * Mixpanel feature flag 이관 판단용 일회성 검증. UI에 영향을 주지 않는다.
 *
 * 확인하려는 것:
 * - 웹/웹뷰 양쪽에서 flag 평가가 되는가 (`is_webview`로 분리)
 * - identify가 안 된 익명 distinct_id도 rollout에 들어가는가 (`is_identified`)
 * - flag fetch가 얼마나 걸리는가 (`fetch_ms`) — 이 값이 flag 기반 배정 대신
 *   exposure_events를 써야 하는지를 가른다
 *
 * 판단이 끝나면 이 파일과 `DIAGNOSTIC_EVENT`, Mixpanel의 `flag_delivery_check`를 함께 지운다.
 */
const FLAG_KEY = 'flag_delivery_check';
const FALLBACK_VARIANT = 'fallback';
const ANONYMOUS_ID_PREFIX = '$device:';

export const runFlagDeliveryCheck = async () => {
  if (!import.meta.env.VITE_MIXPANEL_TOKEN) return;

  const startedAt = performance.now();

  const track = (variant: string, error?: unknown) => {
    mixpanel.track(DIAGNOSTIC_EVENT.FLAG_DELIVERY_CHECKED, {
      flag_key: FLAG_KEY,
      variant,
      fetch_ms: Math.round(performance.now() - startedAt),
      is_webview: isInAppWebView(),
      is_identified: !String(mixpanel.get_distinct_id() ?? '').startsWith(
        ANONYMOUS_ID_PREFIX,
      ),
      error: error === undefined ? undefined : String(error),
    });
  };

  try {
    track(await mixpanel.flags.get_variant_value(FLAG_KEY, FALLBACK_VARIANT));
  } catch (error) {
    // 실패율도 검증 대상이라 삼키지 않고 기록한다
    track(FALLBACK_VARIANT, error);
  }
};
