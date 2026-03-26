export const loadNaverMapScript = () => {
  return new Promise<void>((resolve) => {
    if (window.naver?.maps) {
      resolve();
      return;
    }

    if (document.querySelector('script[src*="maps.js"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_CLIENT_ID}`;
    script.async = true;

    script.onload = () => resolve();

    document.head.appendChild(script);
  });
};