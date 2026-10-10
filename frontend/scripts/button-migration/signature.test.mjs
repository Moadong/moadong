import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buttonSignature,
  DYNAMIC,
  overridesAppearance,
  parseCss,
} from './signature.mjs';

test('선언과 중첩 블록을 나눈다', () => {
  const parsed = parseCss(`
    padding: 12px 16px;
    /* 주석 */
    &:hover { background: #000; }
    @media (max-width: 500px) { padding: 8px; }
  `);
  assert.deepEqual(parsed.decls, { padding: '12px 16px' });
  assert.deepEqual(parsed.blocks['&:hover'], { background: '#000' });
  assert.deepEqual(parsed.blocks['@media (max-width: 500px)'], {
    padding: '8px',
  });
});

test('url 안의 //는 주석이 아니다', () => {
  const parsed = parseCss(
    'background-image: url(https://a.com/x.png); color: #fff; // 끝 주석',
  );
  assert.equal(parsed.decls['background-image'], 'url(https://a.com/x.png)');
  assert.equal(parsed.decls.color, '#fff');
});

test('따옴표 안이나 프로토콜 없는 //는 주석이 아니다', () => {
  const parsed = parseCss(
    'background-image: url("//cdn.example.com/x.png"); content: "a//b"; color: #fff;// 끝 주석\nheight: 40px;',
  );
  assert.equal(
    parsed.decls['background-image'],
    'url("//cdn.example.com/x.png")',
  );
  assert.equal(parsed.decls.content, '"a//b"');
  assert.equal(parsed.decls.color, '#fff');
  assert.equal(parsed.decls.height, '40px');
});

test('축약·색·0 표기가 달라도 같은 시그니처', () => {
  const a = buttonSignature(
    parseCss('padding: 8px 12px; background: #fff; border: 0; color: #111111;'),
  );
  const b = buttonSignature(
    parseCss(
      'color: #111111; background-color: #FFFFFF; padding: 8px 12px 8px 12px; border: 0px;',
    ),
  );
  assert.equal(a.key, b.key);
  assert.deepEqual(a.base, {
    padding: '8px 12px 8px 12px',
    'background-color': '#FFFFFF',
    color: '#111111',
    border: 'none',
  });
});

test('margin·width는 시그니처에 안 들어간다', () => {
  const a = buttonSignature(
    parseCss('height: 40px; margin: 0 auto; width: 100%;'),
  );
  const b = buttonSignature(parseCss('height: 40px;'));
  assert.equal(a.key, b.key);
});

test('hover가 다르면 다른 묶음', () => {
  const a = buttonSignature(
    parseCss('height: 40px; &:hover { background: #000; }'),
  );
  const b = buttonSignature(
    parseCss('height: 40px; &:hover { background: #111; }'),
  );
  assert.notEqual(a.key, b.key);
});

test('동적 값과 동적 믹스인을 표시한다', () => {
  const sig = buttonSignature(
    parseCss(
      `color: ${DYNAMIC}; ${DYNAMIC}; &:hover { background: ${DYNAMIC}; }`,
    ),
  );
  assert.deepEqual(sig.dynamic, ['color', '&:hover background-color', 'mixin']);
});

test('레이아웃만 바꾸는 styled(Button)은 겉모습 덮어쓰기가 아니다', () => {
  assert.equal(
    overridesAppearance(parseCss('margin-top: 8px; width: 100%;')),
    false,
  );
  assert.equal(
    overridesAppearance(parseCss('margin-top: 8px; background: #000;')),
    true,
  );
  assert.equal(
    overridesAppearance(parseCss('&:hover { opacity: 0.8; }')),
    true,
  );
});
