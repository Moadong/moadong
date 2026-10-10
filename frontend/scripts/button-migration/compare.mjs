import { PNG } from 'pngjs';

const DOM_KEYS = ['tag', 'type', 'role', 'disabled', 'ariaSnapshot'];
const BOX_KEYS = ['x', 'y', 'width', 'height'];

// figma-story-diff의 diffPng(threshold 0.1)는 #333333↔#3A3A3A 같은 차이를 0%로 본다.
// 안쪽 span·SVG·가상요소 색은 픽셀로만 잡히므로 여기서는 RGBA가 한 바이트라도 다르면 다른 픽셀이다.
export function exactPixelDiff(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const diff = new PNG({ width, height });
  let mismatched = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const inA = x < a.width && y < a.height;
      const inB = x < b.width && y < b.height;
      const ia = (y * a.width + x) * 4;
      const ib = (y * b.width + x) * 4;
      const same =
        inA && inB && a.data.readUInt32BE(ia) === b.data.readUInt32BE(ib);
      if (same) {
        // 같은 픽셀은 흐린 회색으로 두어 다른 곳이 눈에 띄게 한다
        const g =
          255 -
          Math.round(
            (255 -
              (a.data[ia] * 0.299 +
                a.data[ia + 1] * 0.587 +
                a.data[ia + 2] * 0.114)) *
              0.1,
          );
        diff.data[o] = g;
        diff.data[o + 1] = g;
        diff.data[o + 2] = g;
      } else {
        mismatched += 1;
        diff.data[o] = 255;
        diff.data[o + 1] = 0;
        diff.data[o + 2] = 0;
      }
      diff.data[o + 3] = 255;
    }
  }
  return {
    png: PNG.sync.write(diff),
    mismatchPercent: (mismatched / (width * height)) * 100,
    sameSize: a.width === b.width && a.height === b.height,
    sizes: { before: [a.width, a.height], after: [b.width, b.height] },
  };
}

function compareSnapshot(before, after) {
  const diffs = [];
  for (const k of Object.keys(before.style))
    if (before.style[k] !== after.style[k])
      diffs.push({ key: k, before: before.style[k], after: after.style[k] });
  for (const k of DOM_KEYS)
    if (before.dom[k] !== after.dom[k])
      diffs.push({
        key: `dom.${k}`,
        before: before.dom[k],
        after: after.dom[k],
      });
  const a = JSON.stringify(before.dom.aria);
  const b = JSON.stringify(after.dom.aria);
  if (a !== b) diffs.push({ key: 'dom.aria', before: a, after: b });
  // 부모 셀렉터·형제 변화로 자리만 옮겨 가는 경우는 버튼 자신의 style·픽셀로는 안 보인다
  for (const k of BOX_KEYS)
    if (before.box?.[k] !== after.box?.[k])
      diffs.push({
        key: `box.${k}`,
        before: before.box?.[k],
        after: after.box?.[k],
      });
  return diffs;
}

export function compareRuns(before, after) {
  const widths = [
    ...new Set([...Object.keys(before), ...Object.keys(after)]),
  ].sort((x, y) => Number(x) - Number(y));
  if (widths.every((w) => before[w]?.hidden && after[w]?.hidden))
    return {
      pass: false,
      measuredWidths: 0,
      totalWidths: widths.length,
      hiddenWidths: widths,
      rows: [
        {
          width: '*',
          state: '-',
          diffs: [
            {
              key: 'not-found',
              before: '모든 폭에서 안 보임',
              after: '모든 폭에서 안 보임',
            },
          ],
          pixel: null,
        },
      ],
    };
  const rows = [];
  // 양쪽 다 숨은 폭은 그 브레이크포인트에서 원래 숨는 버튼일 수 있어 실패로 보지 않는다. 대신
  // 잰 폭으로 세지 않고 따로 돌려줘서, "5폭 다 같다"와 "1폭만 쟀다"가 같은 PASS로 안 보이게 한다.
  const hiddenWidths = [];
  let measuredWidths = 0;
  for (const width of widths) {
    const b = before[width];
    const a = after[width];
    if (!b || !a) {
      rows.push({
        width,
        state: '-',
        diffs: [{ key: 'width-missing', before: !!b, after: !!a }],
        pixel: null,
      });
      continue;
    }
    if (b.hidden && a.hidden) {
      hiddenWidths.push(width);
      rows.push({
        width,
        state: '양쪽 안 보임',
        bothHidden: true,
        diffs: [],
        pixel: null,
      });
      continue;
    }
    if (b.hidden || a.hidden) {
      rows.push({
        width,
        state: '-',
        diffs: [{ key: 'visible', before: !b.hidden, after: !a.hidden }],
        pixel: null,
      });
      continue;
    }
    measuredWidths += 1;
    for (const state of ['default', 'hover']) {
      const pixel = exactPixelDiff(b[state].png, a[state].png);
      const diffs = compareSnapshot(b[state], a[state]);
      if (!pixel.sameSize)
        diffs.push({
          key: 'pixel-size',
          before: pixel.sizes.before.join('×'),
          after: pixel.sizes.after.join('×'),
        });
      if (pixel.mismatchPercent > 0)
        diffs.push({
          key: 'pixel',
          before: '0',
          after: `${pixel.mismatchPercent.toFixed(3)}%`,
        });
      rows.push({
        width,
        state,
        diffs,
        pixel: pixel.mismatchPercent,
        diffPng: pixel.png,
      });
    }
  }
  return {
    pass: rows.every((r) => r.diffs.length === 0),
    measuredWidths,
    totalWidths: widths.length,
    hiddenWidths,
    rows,
  };
}
