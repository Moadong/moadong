const useIsWebView = () => {
  const userAgent = navigator.userAgent;

  // React Native WebView (MoadongApp 커스텀)
  const isReactNativeWebView = /MoadongApp/.test(userAgent);

  const isWebView = isReactNativeWebView;

  return {
    isWebView,
  };
};

export default useIsWebView;
