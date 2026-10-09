import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { analyzeFile, resolveDerived } from './extract.mjs';

const values = {
  theme: {
    colors: { gray: { 900: '#3A3A3A' }, base: { white: '#FFFFFF' } },
    typography: {
      paragraph: { p2: { size: '16px', weight: 600, lineHeight: '140%' } },
    },
    transitions: {},
  },
  media: { mobile: '@media (max-width: 500px)' },
};

const resolveModule = (_from, spec) =>
  ({
    './A.styles': 'src/pages/X/A.styles.ts',
    './B.styles': 'src/pages/X/B.styles.ts',
    './Card': 'src/pages/X/Card.tsx',
    '@/components/common/Button/Button':
      'src/components/common/Button/Button.tsx',
    '@/styles/theme/colors': 'src/styles/theme/colors.ts',
    '@/styles/mediaQuery': 'src/styles/mediaQuery.ts',
    '@/styles/theme/typography': 'src/styles/theme/typography.ts',
  })[spec] ?? null;

const fixture = (name) =>
  readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

const styles = analyzeFile({
  file: 'src/pages/X/A.styles.ts',
  text: fixture('A.styles.ts.txt'),
  values,
  resolveModule,
});
const view = analyzeFile({
  file: 'src/pages/X/A.tsx',
  text: fixture('A.tsx.txt'),
  values,
  resolveModule,
});
const def = (name) => styles.definitions.find((d) => d.name === name);

test('버튼 정의만 뽑는다', () => {
  assert.deepEqual(
    styles.definitions.map((d) => [d.name, d.kind]),
    [
      ['Primary', 'styled.button'],
      ['Toggle', 'styled.button'],
      ['Submit', 'styled.button'],
      ['Wide', 'styled(Button)'],
      ['Dark', 'styled(Button)'],
    ],
  );
});

test('테마 참조·setTypography·media를 값으로 푼다', () => {
  const p = def('Primary');
  assert.deepEqual(p.base, {
    padding: '0 16px 0 16px',
    'background-color': '#3A3A3A',
    color: '#FFFFFF',
    'font-size': '16px',
    'font-weight': '600',
    'line-height': '140%',
  });
  assert.deepEqual(p.nested, {
    '@media (max-width: 500px)': { padding: '0 8px 0 8px' },
  });
  assert.deepEqual(p.dynamic, []);
});

test('props에 따라 바뀌는 값은 동적으로 표시한다', () => {
  assert.deepEqual(def('Toggle').dynamic, ['color']);
});

test('attrs를 붙인 styled.button도 정의다', () => {
  assert.deepEqual(def('Submit').base, { height: '40px' });
});

test('styled(Button)의 겉모습 덮어쓰기를 구분한다', () => {
  assert.equal(def('Wide').overridesAppearance, false);
  assert.equal(def('Dark').overridesAppearance, true);
});

test('네임스페이스 import 사용처와 라벨·type을 뽑는다', () => {
  const primary = view.usages.filter((u) => u.name === 'Primary');
  assert.deepEqual(
    primary.map((u) => [u.defFile, u.label, u.typeAttr]),
    [
      ['src/pages/X/A.styles.ts', '지원하기', null],
      ['src/pages/X/A.styles.ts', '지원하기', 'button'],
    ],
  );
  const toggle = view.usages.find((u) => u.name === 'Toggle');
  assert.equal(toggle.label, null);
  assert.equal(toggle.typeAttr, '{expr}');
});

test('같은 파일 안의 정의와 사용처를 잇는다', () => {
  assert.deepEqual(
    view.definitions.map((d) => d.name),
    ['Inline'],
  );
  const inline = view.usages.find((u) => u.name === 'Inline');
  assert.equal(inline.defFile, 'src/pages/X/A.tsx');
  assert.equal(inline.label, '닫기');
});

test('공용 Button JSX는 따로 센다', () => {
  assert.equal(view.commonButtonUsages, 1);
  assert.equal(
    view.usages.some((u) => u.name === 'Button'),
    false,
  );
});

// 기본 import는 로컬 별칭이 자유롭다. 이름이 아니라 defFile로 정의와 잇고,
// 실제 이름은 정의 파일의 defaultExport로 나중에(inventory.mjs) 되짚는다.
const bStyles = analyzeFile({
  file: 'src/pages/X/B.styles.ts',
  text: fixture('B.styles.ts.txt'),
  values,
  resolveModule,
});
const bView = analyzeFile({
  file: 'src/pages/X/B.tsx',
  text: fixture('B.tsx.txt'),
  values,
  resolveModule,
});

test('기본 export된 정의는 defaultExport로 이름을 알려준다', () => {
  assert.deepEqual(
    bStyles.definitions.map((d) => [d.name, d.kind]),
    [['DefaultBtn', 'styled.button']],
  );
  assert.equal(bStyles.defaultExport, 'DefaultBtn');
});

test('기본 import로 쓴 사용처는 로컬 별칭과 무관하게 defFile::default로 잡힌다', () => {
  assert.deepEqual(
    bView.usages.map((u) => [u.defFile, u.name, u.label]),
    [['src/pages/X/B.styles.ts', 'default', '저장']],
  );
});

test('정의 자체가 기본 export인 경우(`export default styled.button`)도 잡는다', () => {
  const cStyles = analyzeFile({
    file: 'src/pages/X/C.styles.ts',
    text: fixture('C.styles.ts.txt'),
    values,
    resolveModule,
  });
  assert.deepEqual(
    cStyles.definitions.map((d) => [d.name, d.kind]),
    [['default', 'styled.button']],
  );
  assert.equal(cStyles.defaultExport, 'default');
});

// styled(X)는 X가 버튼 정의일 때 버튼이다. 놓치면 그 자리가 인벤토리에서 조용히 빠진다.
const dStyles = analyzeFile({
  file: 'src/pages/X/D.styles.ts',
  text: fixture('D.styles.ts.txt'),
  values,
  resolveModule,
});
const card = analyzeFile({
  file: 'src/pages/X/Card.tsx',
  text: fixture('Card.tsx.txt'),
  values,
  resolveModule,
});

test('styled(motion.button)은 styled.button과 같다', () => {
  const intro = dStyles.definitions.find((d) => d.name === 'Intro');
  assert.equal(intro?.kind, 'styled.button');
  assert.deepEqual(intro.base, { height: '48px' });
});

test('styled(X)는 X가 버튼 정의로 풀릴 때만 파생 버튼 정의가 된다', () => {
  const files = [
    ['src/pages/X/A.styles.ts', styles],
    ['src/pages/X/B.styles.ts', bStyles],
    ['src/pages/X/D.styles.ts', dStyles],
    ['src/pages/X/Card.tsx', card],
  ];
  const { derived, unresolved } = resolveDerived({
    definitions: files.flatMap(([, a]) => a.definitions),
    candidates: files.flatMap(([, a]) => a.derivedCandidates),
    defaultExports: new Map(
      files
        .filter(([, a]) => a.defaultExport)
        .map(([f, a]) => [f, a.defaultExport]),
    ),
  });
  assert.deepEqual(
    derived.map((d) => [d.name, d.inherits]),
    [
      ['Chained', 'src/pages/X/D.styles.ts::PrimaryButton'],
      ['Clear', 'src/pages/X/A.styles.ts::Primary'],
      ['DefaultDerived', 'src/pages/X/B.styles.ts::DefaultBtn'],
      ['LayoutOnly', 'src/pages/X/D.styles.ts::Share'],
      ['NsDerived', 'src/pages/X/A.styles.ts::Toggle'],
      ['PrimaryButton', 'src/pages/X/D.styles.ts::BaseButton'],
      ['StudentToggle', 'src/pages/X/D.styles.ts::Share'],
    ],
  );
  for (const d of derived) {
    assert.equal(d.kind, 'styled(button-def)', d.name);
    // 바탕 스타일은 X에서 오므로 자기 템플릿만으로는 묶음 후보가 될 수 없다
    assert.ok(d.dynamic.includes('inherits'), d.name);
  }
  const byName = Object.fromEntries(derived.map((d) => [d.name, d]));
  assert.equal(byName.StudentToggle.overridesAppearance, true);
  assert.equal(byName.LayoutOnly.overridesAppearance, false);
  // 공용 Button에서 온 게 아니면 덮어쓰기 지표에 안 들어간다
  assert.equal(byName.PrimaryButton.overridesAppearance, false);
  assert.deepEqual(
    unresolved.map((c) => [c.name, c.from]),
    [
      ['Tagged', { file: 'src/pages/X/D.styles.ts', name: 'Box' }],
      ['WrappedCard', { file: 'src/pages/X/Card.tsx', name: 'default' }],
    ],
  );
  assert.equal(card.rendersButton, true);
  assert.equal(dStyles.rendersButton, false);
});

test('파생 정의의 묶음 키는 같은 템플릿의 일반 정의와 겹치지 않는다', () => {
  const plain = analyzeFile({
    file: 'src/pages/X/P.styles.ts',
    text: "import styled from 'styled-components';\nexport const P = styled.button`\n  height: 44px;\n`;\n",
    values,
    resolveModule,
  }).definitions[0];
  const { derived } = resolveDerived({
    definitions: dStyles.definitions,
    candidates: dStyles.derivedCandidates,
    defaultExports: new Map(),
  });
  const chained = derived.find((d) => d.name === 'Chained');
  assert.deepEqual(chained.base, plain.base);
  assert.notEqual(chained.key, plain.key);
});
