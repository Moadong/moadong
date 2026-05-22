export const WEBVIEW_FILTER_CONFIG = [
  { label: '동아리', path: '/webview/main' },
  { label: '홍보', path: '/webview/promotions' },
] as const;

export type WebviewFilterPath = (typeof WEBVIEW_FILTER_CONFIG)[number]['path'];
