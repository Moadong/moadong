// 이미지 주소들을 미리 불러 보고 실제로 열린 주소만 돌려주는 훅 (깨진 이미지가 회색 칸으로 뜨지 않게)
import { useEffect, useState } from 'react';

const useLoadedImages = (urls: string[]) => {
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  // 배열이 렌더마다 새로 만들어져도 주소가 같으면 다시 불러오지 않는다
  const key = urls.join('\n');

  useEffect(() => {
    let cancelled = false;
    // 주소로만 찾으니 예전 주소가 남아 있어도 결과에 섞이지 않는다
    key
      .split('\n')
      .filter(Boolean)
      .forEach((url) => {
        const image = new Image();
        image.onload = () => {
          if (cancelled) return;
          setLoaded((prev) => new Set(prev).add(url));
        };
        image.src = url;
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return loaded;
};

export default useLoadedImages;
