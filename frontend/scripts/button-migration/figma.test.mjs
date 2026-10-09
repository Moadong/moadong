import assert from 'node:assert/strict';
import { test } from 'node:test';
import { figmaGate } from './figma-gate.mjs';
import { findCandidates } from './figma-search.mjs';

const theme = {
  colors: new Set(['#3A3A3A', '#FFFFFF']),
  typography: new Map([['16/600/140', 'paragraph.p2']]),
};
const side = (colors, typo, width, height) => ({
  colors: new Map(colors.map((c) => [c, 'n'])),
  typography: new Map(typo.map((t) => [t, 'n'])),
  bbox: { width, height },
});

test('같은 토큰·±2px 안이면 일치', () => {
  const g = figmaGate({
    figma: side(['#3A3A3A', '#FFFFFF'], ['16/600/140'], 287, 44),
    impl: side(['#3A3A3A', '#FFFFFF'], ['16/600/140'], 288.5, 44),
    theme,
  });
  assert.equal(g.pass, true);
});

test('크기가 2px 넘게 다르면 위반', () => {
  const g = figmaGate({
    figma: side(['#3A3A3A'], [], 287, 44),
    impl: side(['#3A3A3A'], [], 287, 46.5),
    theme,
  });
  assert.equal(g.pass, false);
  assert.equal(g.sizePass, false);
});

test('구현에만 있는 색이 있으면 위반', () => {
  const g = figmaGate({
    figma: side(['#3A3A3A'], [], 10, 10),
    impl: side(['#3A3A3A', '#FFFFFF'], [], 10, 10),
    theme,
  });
  assert.equal(g.pass, false);
  assert.deepEqual(g.parityIssues, ['구현에만 색 #FFFFFF']);
});

test('양쪽이 같은 값이면 theme에 없어도 일치, 대신 보고한다', () => {
  const g = figmaGate({
    figma: side(['#123456'], [], 10, 10),
    impl: side(['#123456'], [], 10, 10),
    theme,
  });
  assert.equal(g.pass, true);
  assert.deepEqual(g.tokenIssues, ['시안 색 #123456', '구현 색 #123456']);
});

test('라벨 글자를 감싼, 칠해진 가장 가까운 프레임을 후보로 낸다', () => {
  const page = {
    id: '0:1',
    type: 'CANVAS',
    name: '✳️ 페이지 최종',
    children: [
      {
        id: '1:1',
        type: 'SECTION',
        name: '상세',
        children: [
          {
            id: '1:2',
            type: 'FRAME',
            name: '상세 데스크탑',
            fills: [{ type: 'SOLID', color: {} }],
            children: [
              {
                id: '1:3',
                type: 'FRAME',
                name: 'Frame 5',
                fills: [{ type: 'SOLID', color: {} }],
                cornerRadius: 10,
                children: [
                  {
                    id: '1:4',
                    type: 'TEXT',
                    characters: '지원하기 ',
                    name: 't',
                  },
                ],
              },
              { id: '1:5', type: 'TEXT', characters: '다른 글자', name: 't' },
            ],
          },
        ],
      },
    ],
  };
  assert.deepEqual(findCandidates(page, '지원하기'), [
    {
      nodeId: '1:3',
      name: 'Frame 5',
      screen: '상세 / 상세 데스크탑',
      url: 'https://www.figma.com/design/LB4VudDhuIGjFayrm1kge1/moadong?node-id=1-3',
    },
  ]);
});
