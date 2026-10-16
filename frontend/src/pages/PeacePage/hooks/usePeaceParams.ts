import { useSearchParams } from 'react-router-dom';

const PEACE_SOURCES = ['booth', 'qr', 'share'] as const;
export type PeaceSource = (typeof PEACE_SOURCES)[number];

const isPeaceSource = (value: string | null): value is PeaceSource =>
  value !== null && (PEACE_SOURCES as readonly string[]).includes(value);

/**
 * 부스 모드(kiosk=1)와 유입 경로(src)를 URL 쿼리로만 다룬다. 저장소를 쓰지 않으므로
 * 페이지 사이를 이동할 때 withParams로 이어 붙여야 유지된다.
 */
export const usePeaceParams = () => {
  const [searchParams] = useSearchParams();
  const isKiosk = searchParams.get('kiosk') === '1';
  // URL은 임의 문자열이라 화이트리스트 밖 값은 버린다(Mixpanel 유입 집계 오염 방지)
  const rawSrc = searchParams.get('src');
  const src = isPeaceSource(rawSrc) ? rawSrc : undefined;

  const withParams = (path: string) => {
    const carried = new URLSearchParams();
    if (isKiosk) carried.set('kiosk', '1');
    if (src) carried.set('src', src);
    const query = carried.toString();
    if (!query) return path;
    return `${path}${path.includes('?') ? '&' : '?'}${query}`;
  };

  return { isKiosk, src, withParams };
};
