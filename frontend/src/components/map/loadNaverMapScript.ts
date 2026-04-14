export const loadNaverMapScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.naver?.maps) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="oapi.map.naver.com"]',
    ) as HTMLScriptElement;

    if (existingScript) {
      // 스크립트가 이미 존재하지만 로드 전인 경우 이벤트를 기다림
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Naver Map SDK 로드 실패')),
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
      import.meta.env.VITE_NAVER_MAP_CLIENT_ID
    }`;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Naver Map SDK 로드 실패'));

    document.head.appendChild(script);
  });
};
