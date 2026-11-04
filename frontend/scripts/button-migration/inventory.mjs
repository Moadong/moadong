// 단계 ①: src 전체에서 버튼 정의·사용처를 모아 sites.json과 묶음 분포 리포트를 만든다.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { importTs } from '../figma-story-diff/theme.mjs';
import { analyzeFile, COMMON_BUTTON, resolveDerived } from './extract.mjs';
import {
  buildSites,
  clusters,
  loadSites,
  mergeSites,
  saveSites,
  SITES_FILE,
  summarize,
} from './sites.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'visual-diff/button-inventory');
// 스토리·테스트는 제품 화면이 아니다
const SKIP = /\.(stories|test)\.tsx?$|\/styles\/theme\.test\//;
const EXTS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !SKIP.test(p))
      out.push(path.relative(ROOT, p));
  }
  return out;
}

function resolveModule(fromFile, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(ROOT, 'src', spec.slice(2));
  else if (spec.startsWith('.'))
    base = path.join(ROOT, path.dirname(fromFile), spec);
  else return null;
  for (const ext of EXTS) {
    const p = base + ext;
    if (existsSync(p) && statSync(p).isFile()) return path.relative(ROOT, p);
  }
  return null;
}

const fmt = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ') || '–';

function renderReport({
  summary,
  clusters: cs,
  definitions,
  unused,
  unresolved,
}) {
  const byKind = (kind) => definitions.filter((d) => d.kind === kind).length;
  const rows = cs.map(
    (c, i) =>
      `| ${i + 1} | \`${c.key}\` | ${c.sites.length} | ${c.domains.length} | ${c.dynamic.join(', ') || '–'} | ${c.candidate ? '✅' : ''} | ${fmt(c.signature)} | ${Object.keys(c.nested).join(', ') || '–'} | ${[...new Set(c.sites.map((s) => s.name))].slice(0, 3).join(', ')} |`,
  );
  return `# 버튼 인벤토리

생성: ${new Date().toISOString()}

| 지표 | 값 |
|---|---|
| 정의 | styled.button ${byKind('styled.button')} · styled(Button) ${byKind('styled(Button)')} · 버튼 정의를 감싼 styled(X) ${byKind('styled(button-def)')} (사용처 없음 ${unused.length}) |
| 자리 | ${summary.sites} |
| 서로 다른 시그니처 | ${summary.signatures} |
| 후보 묶음 (도메인 2곳 이상·동적 없음) | ${summary.candidateClusters}개 · 자리 ${summary.candidateSites}개 |
| 공용 Button JSX | 파일 ${summary.commonButton.files} · 사용 ${summary.commonButton.jsx} |
| 겉모습을 덮어쓰는 styled(Button) (그것을 다시 감싼 파생 포함) | ${summary.overrides} |
| 상태별 | ${fmt(summary.byStatus)} |

## 묶음

| # | 키 | 자리 | 도메인 | 동적 | 후보 | 시그니처 | 하위 블록 | 예시 |
|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## 사용처 없는 정의

${unused.map((d) => `- \`${d.file}:${d.line}\` ${d.name}`).join('\n') || '없음'}

## 못 푼 styled(X) 중 버튼을 그릴 수 있는 것

X가 버튼 정의로 풀리지 않았지만, X가 있는 파일이 \`<button>\`이나 버튼 정의를 그린다. 버튼이면 인벤토리에서 빠진 자리라 손으로 확인한다.

${unresolved.map((c) => `- \`${c.file}:${c.line}\` ${c.name} = styled(${c.fromText}) → \`${c.from.file}\``).join('\n') || '없음'}
`;
}

const { theme } = await importTs(path.join(ROOT, 'src/styles/theme/index.ts'));
const { media } = await importTs(path.join(ROOT, 'src/styles/mediaQuery.ts'));
const values = { theme, media };

const definitions = [];
const usages = [];
const candidates = [];
const commonButton = { files: 0, jsx: 0 };
// 파일별 default export가 가리키는 정의 이름. 기본 import 사용처의 name: 'default'를 여기로 되짚는다
const defaultExports = new Map();
const rendersButton = new Set();
for (const file of walk(path.join(ROOT, 'src'))) {
  const text = readFileSync(path.join(ROOT, file), 'utf8');
  const r = analyzeFile({ file, text, values, resolveModule });
  // 공용 Button 내부 구현은 이전 대상이 아니다
  if (file !== COMMON_BUTTON) {
    definitions.push(...r.definitions);
    candidates.push(...r.derivedCandidates);
  }
  usages.push(...r.usages);
  if (r.defaultExport) defaultExports.set(file, r.defaultExport);
  if (r.rendersButton) rendersButton.add(file);
  if (r.commonButtonUsages) {
    commonButton.files += 1;
    commonButton.jsx += r.commonButtonUsages;
  }
}

// styled(X)는 모든 파일을 본 뒤에야 X가 버튼인지 안다 (X가 다른 파일·연쇄일 수 있다)
const { derived, unresolved } = resolveDerived({
  definitions,
  candidates,
  defaultExports,
});
definitions.push(...derived);

// 기본 import로 쓴 자리는 정의 파일의 실제 이름으로 되짚어야 정의와 이어진다
const resolvedUsages = usages.map((u) =>
  u.name === 'default'
    ? { ...u, name: defaultExports.get(u.defFile) ?? 'default' }
    : u,
);

const sites = mergeSites(
  loadSites(SITES_FILE),
  buildSites(definitions, resolvedUsages),
);
saveSites(SITES_FILE, sites);

// 파생 정의의 바탕으로만 쓰이는 정의(ErrorBoundary의 BaseButton 등)는 안 쓰인 게 아니다
const used = new Set([
  ...resolvedUsages.map((u) => `${u.defFile}::${u.name}`),
  ...derived.map((d) => d.inherits),
]);
const unused = definitions.filter((d) => !used.has(`${d.file}::${d.name}`));
const defKeys = new Set(definitions.map((d) => `${d.file}::${d.name}`));
for (const u of resolvedUsages)
  if (defKeys.has(`${u.defFile}::${u.name}`)) rendersButton.add(u.usageFile);
const unresolvedButtons = unresolved.filter(
  (c) => c.from && rendersButton.has(c.from.file),
);
const overrides = definitions.filter((d) => d.overridesAppearance).length;
const summary = summarize(sites, { commonButton, overrides });

await mkdir(OUT, { recursive: true });
await writeFile(
  path.join(OUT, 'report.md'),
  renderReport({
    summary,
    clusters: clusters(sites),
    definitions,
    unused,
    unresolved: unresolvedButtons,
  }),
);
await writeFile(
  path.join(OUT, 'summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(
  `정의 ${definitions.length} · 자리 ${summary.sites} · 시그니처 ${summary.signatures} · 후보 묶음 ${summary.candidateClusters}(자리 ${summary.candidateSites}) → visual-diff/button-inventory/report.md`,
);
