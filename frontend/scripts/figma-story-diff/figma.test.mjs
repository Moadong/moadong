import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { compositeSolidStack, extractTokens } from './figma.mjs';

const solid = (hex, opacity) => {
  const n = parseInt(hex.slice(1), 16);
  return {
    type: 'SOLID',
    color: {
      r: (n >> 16) / 255,
      g: ((n >> 8) & 0xff) / 255,
      b: (n & 0xff) / 255,
    },
    ...(opacity === undefined ? {} : { opacity }),
  };
};

const toHex = ({ r, g, b }) =>
  '#' +
  [r, g, b]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase();

describe('compositeSolidStack', () => {
  it('불투명 바닥 위 반투명 단색을 아래부터 차례로 합성한다', () => {
    const color = compositeSolidStack([
      solid('#4B4B4B'),
      solid('#000000', 0.2),
      solid('#000000', 0.2),
    ]);
    // 채널마다 75 × 0.8 × 0.8 = 48
    assert.equal(toHex(color), '#303030');
  });

  it('레이어가 하나뿐이거나 바닥이 반투명이면 합성하지 않는다', () => {
    assert.equal(compositeSolidStack([solid('#4B4B4B')]), null);
    assert.equal(
      compositeSolidStack([solid('#4B4B4B', 0.5), solid('#000000', 0.2)]),
      null,
    );
  });

  it('노드 자체가 반투명이거나 그라디언트가 섞이면 합성하지 않는다', () => {
    const stack = [solid('#4B4B4B'), solid('#000000', 0.2)];
    assert.equal(compositeSolidStack(stack, 0.5), null);
    assert.equal(
      compositeSolidStack([...stack, { type: 'GRADIENT_LINEAR' }]),
      null,
    );
  });

  it('숨긴 레이어는 합성에서 뺀다', () => {
    const color = compositeSolidStack([
      solid('#4B4B4B'),
      { ...solid('#000000', 0.2), visible: false },
      solid('#000000', 0.2),
    ]);
    // 보이는 겹침 한 겹만 합성된다: 75 × 0.8 = 60
    assert.equal(toHex(color), '#3C3C3C');
  });

  it('일반 겹침이 아닌 블렌드 모드가 섞이면 합성하지 않는다', () => {
    assert.equal(
      compositeSolidStack([
        solid('#4B4B4B'),
        { ...solid('#000000', 0.2), blendMode: 'MULTIPLY' },
      ]),
      null,
    );
    assert.equal(
      toHex(
        compositeSolidStack([
          { ...solid('#4B4B4B'), blendMode: 'NORMAL' },
          { ...solid('#000000', 0.2), blendMode: 'NORMAL' },
        ]),
      ),
      '#3C3C3C',
    );
  });
});

describe('extractTokens', () => {
  it('겹친 fill은 합성색만 사용 색으로 세고 겹친 레이어는 반투명으로 남긴다', () => {
    const { colors, translucent } = extractTokens({
      type: 'TEXT',
      name: '지원서 제목',
      fills: [solid('#4B4B4B'), solid('#000000', 0.2), solid('#000000', 0.2)],
    });
    assert.deepEqual([...colors.keys()], ['#303030']);
    assert.deepEqual([...translucent.keys()], ['#000000@20%']);
  });

  it('겹침이 없는 단색 fill은 그대로 센다', () => {
    const { colors } = extractTokens({
      type: 'FRAME',
      name: '카드',
      fills: [solid('#FAFAFA')],
      strokes: [solid('#EBEBEB')],
    });
    assert.deepEqual([...colors.keys()].sort(), ['#EBEBEB', '#FAFAFA']);
  });
});
