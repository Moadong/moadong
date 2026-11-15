const CDN_HOST = 'cdn.moadong.com';

/**
 * 용도별 요청 크기. 표시 칸이 가장 커지는 화면 기준 CSS px × DPR로 잡는다.
 * 출력 면적이 2,560,000px(1600×1600)을 넘으면 Cloudflare가 AVIF 대신 WebP로 내려서
 * 원본보다 커질 수 있으니 모든 크기를 그 아래로 둔다. 단 modal은 예외다. 1200px 모달을
 * 레티나로 보려면 긴 변 2400px가 필요하고, 큰 사진은 WebP로 나가는 것을 감수한다.
 *
 * - crop: 칸 비율이 화면과 무관하게 고정인 곳. CSS object-fit: cover와 같은 가운데 기준으로
 *   미리 자르고, 원본이 더 작으면 키우지 않는다.
 * - scale-down: 칸 비율이 화면마다 달라지는 곳. 비율을 유지한 채 줄이기만 하고 자르기는 CSS에 맡긴다.
 */
export const CDN_IMAGE_SIZES = {
  // 4:5 고정. 태블릿 3열 232×290 ×2, 폰 165×207 ×3
  grid: { width: 480, height: 600, fit: 'crop' },
  // 400×220 ~ 700×220로 비율이 바뀐다. 태블릿 700 ×2, 폰 500 ×3, 높이 220 ×3
  cover: { width: 1500, height: 1500, fit: 'scale-down' },
  // 1:1 고정. 64 ×2, 태블릿 이하 57 ×3
  logo: { width: 192, height: 192, fit: 'crop' },
  // 1:1 고정. 40 ×2, 28 ×3
  thumbnail: { width: 88, height: 88, fit: 'crop' },
  // 비율이 사진마다 다르다. 모달 최대 1200 ×2. 면적이 AVIF 상한을 넘어 큰 사진은 WebP로 나간다
  modal: { width: 2400, height: 2400, fit: 'scale-down' },
} as const;

export type CdnImageUsage = keyof typeof CDN_IMAGE_SIZES;

/**
 * cdn.moadong.com 이미지를 Cloudflare Image Transformations URL로 바꾼다.
 * 다른 호스트(dev의 cdn.yourun.shop, 번들 에셋, blob 등)는 변환할 수 없으니 그대로 돌려준다.
 */
const cdnImage = (url: string, usage: CdnImageUsage): string => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  // 쿼리가 있으면 원본 경로를 보존할 수 없으니 건드리지 않는다
  if (parsed.hostname !== CDN_HOST || parsed.search) return url;

  const { width, height, fit } = CDN_IMAGE_SIZES[usage];
  return `https://${CDN_HOST}/cdn-cgi/image/format=auto,width=${width},height=${height},fit=${fit}${parsed.pathname}`;
};

export default cdnImage;
