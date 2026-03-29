export const loadNaverMapScript = () => {
  console.log(import.meta.env);
  console.log('NAVER CLIENT ID: ', import.meta.env.VITE_NAVER_CLIENT_ID);

  return new Promise<void>((resolve) => {
    if (window.naver?.maps) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="oapi.map.naver.com"]',
    );
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
    script.async = true;

    script.onload = () => resolve();

    document.head.appendChild(script);
  });
};
