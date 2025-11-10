const useIsWebView = () => {
  const userAgent = navigator.userAgent;

  // Android WebView
  const isAndroidWebView = /Android/.test(userAgent) && /wv/.test(userAgent);

  // iOS WebView
  const isIOSWebView =
    /iPhone|iPad|iPod/.test(userAgent) &&
    /AppleWebKit/.test(userAgent) &&
    !/Safari/.test(userAgent);

  return {
    isWebView: isAndroidWebView || isIOSWebView,
    isIOSWebView,
    isAndroidWebView,
  };
};

export default useIsWebView;
