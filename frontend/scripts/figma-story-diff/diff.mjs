// figma-story-diff 전용 참고 픽셀 차이. 시안 PNG와 구현 스크린샷은 렌더러가 달라 정확히 같을 수 없어
// threshold 0.1로 무디게 본다. 같은 브라우저끼리 비교하는 판정(button-migration before/after)에 쓰면
// #333333↔#3A3A3A 같은 차이가 0%로 숨는다 — 그쪽은 compare.mjs의 정확 비교를 쓴다.
// 두 PNG를 같은 캔버스 크기로 맞춰 pixelmatch로 비교한다. 결과는 참고용(게이트 아님).
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

function fit(png, width, height) {
  const out = new PNG({ width, height, fill: true });
  out.data.fill(255);
  PNG.bitblt(
    png,
    out,
    0,
    0,
    Math.min(png.width, width),
    Math.min(png.height, height),
    0,
    0,
  );
  return out;
}

export function diffPng(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(
    fit(a, width, height).data,
    fit(b, width, height).data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
    },
  );
  return {
    png: PNG.sync.write(diff),
    mismatchPercent: (mismatched / (width * height)) * 100,
    sizes: { figma: [a.width, a.height], story: [b.width, b.height] },
  };
}
