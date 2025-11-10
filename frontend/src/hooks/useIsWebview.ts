const useIsWebView = () => {
  const userAgent = navigator.userAgent;

  // React Native WebView (MoadongApp 커스텀)
  const isReactNativeWebView = /MoadongApp/.test(userAgent);

  // Android Native WebView
  const isAndroidWebView = /Android/.test(userAgent) && /wv/.test(userAgent);

  // iOS Native WebView
  const isIOSWebView =
    /iPhone|iPad|iPod/.test(userAgent) &&
    /AppleWebKit/.test(userAgent) &&
    !/Safari/.test(userAgent);

  const isWebView = isReactNativeWebView || isAndroidWebView || isIOSWebView;

  // 디버깅용 로그
  console.group('🔍 WebView Detection');
  console.log('User Agent:', userAgent);
  console.log('React Native (MoadongApp):', isReactNativeWebView);
  console.log('Android Native WebView:', isAndroidWebView);
  console.log('iOS Native WebView:', isIOSWebView);
  console.log('Is WebView (최종):', isWebView);
  console.groupEnd();

  return {
    isWebView,
    isReactNativeWebView,
    isAndroidWebView,
    isIOSWebView,
  };
};

export default useIsWebView;
