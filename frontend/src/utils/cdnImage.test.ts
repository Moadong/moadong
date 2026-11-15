import cdnImage, { CDN_IMAGE_SIZES, CdnImageUsage } from './cdnImage';

const FEED =
  'https://cdn.moadong.com/6873c0bb9033815c43911964/feed/qOr54TrgWQ.webp';

describe('cdnImage', () => {
  it('cdn.moadong.com 이미지는 용도별 크기의 경로형 변환 URL로 바꾼다', () => {
    expect(cdnImage(FEED, 'grid')).toBe(
      'https://cdn.moadong.com/cdn-cgi/image/format=auto,width=480,height=600,fit=crop/6873c0bb9033815c43911964/feed/qOr54TrgWQ.webp',
    );
    expect(cdnImage(FEED, 'thumbnail')).toBe(
      'https://cdn.moadong.com/cdn-cgi/image/format=auto,width=88,height=88,fit=crop/6873c0bb9033815c43911964/feed/qOr54TrgWQ.webp',
    );
  });

  it('칸 비율이 화면마다 바뀌는 커버는 자르지 않고 비율을 유지해 줄인다', () => {
    expect(
      cdnImage(
        'https://cdn.moadong.com/6873c0bb9033815c43911964/cover/DybuJqvG3F.webp',
        'cover',
      ),
    ).toBe(
      'https://cdn.moadong.com/cdn-cgi/image/format=auto,width=1500,height=1500,fit=scale-down/6873c0bb9033815c43911964/cover/DybuJqvG3F.webp',
    );
  });

  it('파일 이름의 공백은 인코딩된 경로로 넘긴다', () => {
    expect(
      cdnImage(
        'https://cdn.moadong.com/67e54ae51cfd27718dd40be8/feed/1741570733929 - know U.webp',
        'grid',
      ),
    ).toBe(
      'https://cdn.moadong.com/cdn-cgi/image/format=auto,width=480,height=600,fit=crop/67e54ae51cfd27718dd40be8/feed/1741570733929%20-%20know%20U.webp',
    );
  });

  it('같은 입력과 용도에는 항상 같은 URL을 돌려준다', () => {
    expect(cdnImage(FEED, 'cover')).toBe(cdnImage(FEED, 'cover'));
  });

  it.each([
    ['dev CDN', 'https://cdn.yourun.shop/abc/feed/x.webp'],
    [
      '이름이 비슷한 다른 호스트',
      'https://cdn.moadong.com.evil.com/abc/x.webp',
    ],
    ['하위 도메인이 다른 호스트', 'https://xcdn.moadong.com/abc/x.webp'],
    ['배너 호스트', 'https://banner.moadong.com/web/banner.png'],
    ['쿼리가 붙은 URL', `${FEED}?v=2`],
    ['번들 에셋 경로', '/assets/default_cover_image.png'],
    ['blob URL', 'blob:https://www.moadong.com/1234-5678'],
    ['data URL', 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E'],
    ['빈 문자열', ''],
  ])('%s: 그대로 돌려준다', (_, url) => {
    expect(cdnImage(url, 'grid')).toBe(url);
  });

  it('모달은 원본 비율을 유지한 채 긴 변 2400px 이하로 줄인다', () => {
    expect(cdnImage(FEED, 'modal')).toBe(
      'https://cdn.moadong.com/cdn-cgi/image/format=auto,width=2400,height=2400,fit=scale-down/6873c0bb9033815c43911964/feed/qOr54TrgWQ.webp',
    );
  });

  it('모달을 뺀 모든 용도의 출력 면적은 AVIF 상한(2,560,000px) 이하다', () => {
    (Object.keys(CDN_IMAGE_SIZES) as CdnImageUsage[])
      .filter((usage) => usage !== 'modal')
      .forEach((usage) => {
        const { width, height } = CDN_IMAGE_SIZES[usage];
        expect(width * height).toBeLessThanOrEqual(2_560_000);
      });
  });
});
